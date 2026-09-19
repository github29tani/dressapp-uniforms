"use client"

import { useState, useEffect } from "react"
import { Trash2, Loader2, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface OrphanedImage {
  id: string
  url: string
  product_id: string
  product_name: string
}

export default function AdminCleanupPage() {
  const [orphanedImages, setOrphanedImages] = useState<OrphanedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [cleaning, setCleaning] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadOrphanedImages()
  }, [])

  async function loadOrphanedImages() {
    setLoading(true)
    try {
      // Get all product images with product info
      const { data: images } = await supabase
        .from("product_images")
        .select("id, url, product_id, products(name)")
        .order("created_at", { ascending: false })

      if (!images) {
        setOrphanedImages([])
        setLoading(false)
        return
      }

      // Check each image to see if it exists in storage
      const orphaned: OrphanedImage[] = []
      
      for (const image of images) {
        // Extract the file path from the URL
        // URL format: https://xxx.supabase.co/storage/v1/object/public/product-images/path/to/file.jpg
        const urlParts = image.url.split('/product-images/')
        if (urlParts.length < 2) continue
        
        const filePath = urlParts[1]
        
        // Check if file exists in storage
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('product-images')
          .list(filePath.split('/').slice(0, -1).join('/'), {
            search: filePath.split('/').pop()
          })

        // If file doesn't exist or there's an error, it's orphaned
        if (!fileData || fileData.length === 0 || fileError) {
          orphaned.push({
            id: image.id,
            url: image.url,
            product_id: image.product_id,
            product_name: (image as any).products?.name || 'Unknown Product'
          })
        }
      }

      setOrphanedImages(orphaned)
    } catch (err) {
      console.error('Error loading images:', err)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  async function deleteAllOrphaned() {
    if (!confirm(`Delete ${orphanedImages.length} orphaned image records from database?`)) {
      return
    }

    setCleaning(true)
    setError(null)
    setSuccess(null)

    try {
      const ids = orphanedImages.map(img => img.id)
      
      const { error: deleteError } = await supabase
        .from('product_images')
        .delete()
        .in('id', ids)

      if (deleteError) throw deleteError

      setSuccess(`Successfully deleted ${ids.length} orphaned image records`)
      setOrphanedImages([])
      
      // Reload after a moment
      setTimeout(() => {
        setSuccess(null)
        loadOrphanedImages()
      }, 2000)

    } catch (err: any) {
      console.error('Error deleting images:', err)
      setError(err.message || 'Failed to delete orphaned images')
    } finally {
      setCleaning(false)
    }
  }

  async function deleteOne(id: string) {
    try {
      const { error: deleteError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setOrphanedImages(prev => prev.filter(img => img.id !== id))
      setSuccess('Deleted 1 orphaned image record')
      setTimeout(() => setSuccess(null), 2000)

    } catch (err: any) {
      console.error('Error deleting image:', err)
      setError(err.message || 'Failed to delete image')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <span className="font-bold text-gray-900">Database Cleanup</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1 shrink-0" />
              <div>
                <h2 className="font-semibold text-lg mb-2">Orphaned Image Records</h2>
                <p className="text-sm text-gray-600 mb-3">
                  These are image records in the database where the actual file has been deleted from Supabase Storage.
                  Products will show broken images instead of the shirt icon placeholder until these records are removed.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> This only deletes database records, not actual files (since they're already deleted).
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
                <span className="ml-3 text-gray-600">Checking for orphaned images...</span>
              </div>
            ) : orphanedImages.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-900">
                    ✓ No orphaned image records found. Database is clean!
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-orange-900 mb-1">
                    Found {orphanedImages.length} orphaned image record{orphanedImages.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-orange-700">
                    These records reference files that no longer exist in storage
                  </p>
                </div>

                <Button
                  onClick={deleteAllOrphaned}
                  disabled={cleaning}
                  className="w-full bg-red-600 hover:bg-red-700 text-white mb-4"
                >
                  {cleaning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All {orphanedImages.length} Orphaned Records
                    </>
                  )}
                </Button>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-sm font-medium text-green-900">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {orphanedImages.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Orphaned Records ({orphanedImages.length})</h3>
              <div className="space-y-2">
                {orphanedImages.map((img) => (
                  <div
                    key={img.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {img.product_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{img.url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOne(img.id)}
                      className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
