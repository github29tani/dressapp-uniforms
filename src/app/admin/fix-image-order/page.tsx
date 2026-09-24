"use client"

import { useState } from "react"
import { RefreshCw, Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function FixImageOrderPage() {
  const [fixing, setFixing] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<string[]>([])

  async function fixImageOrder() {
    setFixing(true)
    setSuccess(null)
    setError(null)
    setDetails([])

    try {
      const supabase = createClient()
      const logs: string[] = []

      // Get all products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name")

      if (productsError) throw productsError

      logs.push(`Found ${products.length} products`)
      setDetails([...logs])

      let totalFixed = 0

      // For each product, get its images and renumber them
      for (const product of products) {
        const { data: images, error: imagesError } = await supabase
          .from("product_images")
          .select("id, url, created_at")
          .eq("product_id", product.id)
          .order("created_at", { ascending: true })

        if (imagesError) {
          logs.push(`❌ Error loading images for ${product.name}: ${imagesError.message}`)
          setDetails([...logs])
          continue
        }

        if (!images || images.length === 0) {
          logs.push(`⚪ ${product.name}: No images`)
          setDetails([...logs])
          continue
        }

        // Update sort_order for each image based on created_at order
        for (let i = 0; i < images.length; i++) {
          const { error: updateError } = await supabase
            .from("product_images")
            .update({ sort_order: i })
            .eq("id", images[i].id)

          if (updateError) {
            logs.push(`❌ Error updating ${product.name} image ${i}: ${updateError.message}`)
            setDetails([...logs])
          }
        }

        totalFixed += images.length
        logs.push(`✅ ${product.name}: Fixed ${images.length} image${images.length !== 1 ? 's' : ''}`)
        setDetails([...logs])
      }

      setSuccess(`Successfully fixed ${totalFixed} images across ${products.length} products!`)
    } catch (err: any) {
      console.error("Fix error:", err)
      setError(err.message || "Failed to fix image order")
    } finally {
      setFixing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-blue-700" />
          <span className="font-bold text-gray-900">Fix Image Order</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Reset All Product Image Order</h2>
                <p className="text-sm text-gray-600">
                  This will renumber all product images based on when they were uploaded (oldest first).
                  The first uploaded image will become the main thumbnail for each product.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">What this does:</p>
                    <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Finds all images for each product</li>
                      <li>Sorts them by upload date (oldest first)</li>
                      <li>Assigns sort_order: 0, 1, 2, etc.</li>
                      <li>First image (0) becomes the main thumbnail</li>
                    </ul>
                  </div>
                </div>
              </div>

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-green-900">{success}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-red-900">{error}</p>
                  </div>
                </div>
              )}

              {details.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Progress:</p>
                  <div className="space-y-1">
                    {details.map((detail, idx) => (
                      <p key={idx} className="text-xs text-gray-600 font-mono">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={fixImageOrder}
                disabled={fixing}
                className="w-full bg-blue-700 hover:bg-blue-800"
                size="lg"
              >
                {fixing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Fixing Image Order...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Fix All Product Image Order
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                After fixing, refresh your product pages to see the updated thumbnails
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
