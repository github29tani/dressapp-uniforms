"use client"

import { useState, useEffect } from "react"
import { Trash2, Loader2, AlertCircle, Check, Image as ImageIcon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { Product, Category } from "@/types"

interface ProductImageData {
  id: string
  url: string
  product_id: string
  product_name: string
  category_name: string
  created_at: string
}

export default function ManageImagesPage() {
  const [images, setImages] = useState<ProductImageData[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadImages()
  }, [])

  async function loadImages() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from("product_images")
        .select(`
          id, 
          url, 
          product_id, 
          created_at,
          products(name, category:categories(name))
        `)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      const formatted = (data || []).map((img: any) => ({
        id: img.id,
        url: img.url,
        product_id: img.product_id,
        product_name: img.products?.name || 'Unknown Product',
        category_name: img.products?.category?.name || 'Unknown Category',
        created_at: img.created_at
      }))

      setImages(formatted)
    } catch (err: any) {
      console.error('Error loading images:', err)
      setError(err.message || 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(images.map(img => img.id)))
    }
  }

  async function deleteSelected() {
    if (selectedIds.size === 0) return

    if (!confirm(`Delete ${selectedIds.size} image${selectedIds.size !== 1 ? 's' : ''}? This will:\n\n1. Delete the image file from Supabase Storage\n2. Remove the database record\n\nThis action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      const selectedImages = images.filter(img => selectedIds.has(img.id))
      let deletedCount = 0
      let failedCount = 0

      // Delete each image from storage and database
      for (const image of selectedImages) {
        try {
          // Extract file path from URL
          const urlParts = image.url.split('/product-images/')
          if (urlParts.length >= 2) {
            const filePath = urlParts[1]
            
            // Delete from storage
            await supabase
              .storage
              .from('product-images')
              .remove([filePath])
          }

          // Delete from database
          const { error: dbError } = await supabase
            .from('product_images')
            .delete()
            .eq('id', image.id)

          if (dbError) throw dbError

          deletedCount++
        } catch (err) {
          console.error(`Failed to delete image ${image.id}:`, err)
          failedCount++
        }
      }

      if (deletedCount > 0) {
        setSuccess(`Successfully deleted ${deletedCount} image${deletedCount !== 1 ? 's' : ''}${failedCount > 0 ? ` (${failedCount} failed)` : ''}`)
        setSelectedIds(new Set())
        loadImages()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError('Failed to delete any images')
      }

    } catch (err: any) {
      console.error('Error deleting images:', err)
      setError(err.message || 'Failed to delete images')
    } finally {
      setDeleting(false)
    }
  }

  const allSelected = images.length > 0 && selectedIds.size === images.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-blue-700" />
            <span className="font-bold text-gray-900">Manage Product Images</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadImages}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {loading ? 'Loading...' : `${images.length} image${images.length !== 1 ? 's' : ''} total`}
                </p>
                {selectedIds.size > 0 && (
                  <p className="text-sm font-semibold text-blue-700">
                    {selectedIds.size} selected
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {images.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectAll}
                    disabled={loading}
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </Button>
                )}
                
                <Button
                  onClick={deleteSelected}
                  disabled={selectedIds.size === 0 || deleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected ({selectedIds.size})
                    </>
                  )}
                </Button>
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-green-900">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
            <span className="ml-3 text-gray-600">Loading images...</span>
          </div>
        ) : images.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Found</h3>
              <p className="text-gray-500 mb-6">Upload product images to get started</p>
              <Button
                onClick={() => window.location.href = '/admin/images'}
                className="bg-blue-700 hover:bg-blue-800"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className={`overflow-hidden transition-all ${selectedIds.has(image.id) ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.product_name}
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    
                    {/* Checkbox Overlay */}
                    <div className="absolute top-2 left-2">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                        selectedIds.has(image.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white/90 border-gray-300 hover:border-blue-400'
                      }`}
                        onClick={() => toggleSelect(image.id)}
                      >
                        {selectedIds.has(image.id) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 border-t">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                      {image.product_name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{image.category_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(image.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
