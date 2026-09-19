"use client"

import { useState, useEffect } from "react"
import { Upload, Image as ImageIcon, Loader2, Check, X, AlertCircle, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Product, Category } from "@/types"
import Image from "next/image"

type ImageFit = "cover" | "contain"

export default function AdminImagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [imageFit, setImageFit] = useState<ImageFit>("cover")
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(id,url,alt_text)")
      .order("name")
    setProducts((data ?? []) as Product[])
    setLoading(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setSelectedFile(file)
    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleUpload() {
    if (!selectedProduct || !selectedFile) {
      setError("Please select a product and an image")
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const product = products.find(p => p.id === selectedProduct)
      if (!product) throw new Error("Product not found")

      const category = product.category as Category
      const fileName = `${category.slug}/${product.slug}-${Date.now()}.${selectedFile.name.split('.').pop()}`

      // Create FormData to send to API route
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('productId', selectedProduct)
      formData.append('fileName', fileName)

      // Upload via API route (bypasses RLS issues)
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setSuccess(`Image uploaded successfully for ${product.name}`)
      setSelectedFile(null)
      setPreview("")
      setSelectedProduct("")
      
      // Reload products to show updated images
      loadProducts()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)

    } catch (err: any) {
      console.error("Full error:", err)
      setError(err.message || "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const selectedProductData = products.find(p => p.id === selectedProduct)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-blue-700" />
          <span className="font-bold text-gray-900">Product Image Upload</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Upload Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">Upload Product Image</h2>
            
            <div className="space-y-6">
              {/* Product Selection */}
              <div>
                <Label htmlFor="product">Select Product *</Label>
                <Select value={selectedProduct} onValueChange={(value) => setSelectedProduct(value || "")}>

                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                    ) : products.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No products found</div>
                    ) : (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {(product.category as Category)?.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Current Image Preview */}
              {selectedProductData && selectedProductData.images && selectedProductData.images.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-900">Product Already Has Image</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Uploading a new image will <strong>replace</strong> the existing one. The old image will be permanently deleted.
                      </p>
                    </div>
                  </div>
                  <Label className="text-xs text-gray-600 mb-2 block">Current Image:</Label>
                  <div className="relative w-40 h-52 rounded-lg overflow-hidden border-2 border-amber-300">
                    <Image
                      src={selectedProductData.images[0].url}
                      alt={selectedProductData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* File Input */}
              <div>
                <Label htmlFor="file">Select Image File *</Label>
                <div className="mt-2">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {preview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-contain p-2"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedFile(null)
                            setPreview("")
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG or WebP (max 5MB)</p>
                      </div>
                    )}
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>

              {/* Image Preview - How it will look in UI */}
              {preview && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Preview in Product Card (4:5 ratio)</Label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setImageFit("cover")}
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          imageFit === "cover"
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Maximize2 className="h-3 w-3" />
                        Fill (Crop)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageFit("contain")}
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          imageFit === "contain"
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Minimize2 className="h-3 w-3" />
                        Fit (Full)
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Current Selection */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        {imageFit === "cover" ? "Fill/Crop (Recommended)" : "Fit/Full"}
                      </p>
                      <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden border-2 border-blue-500">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className={imageFit === "cover" ? "object-cover" : "object-contain"}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {imageFit === "cover" ? "✓ Fills entire frame (may crop edges)" : "Shows full image (may have gaps)"}
                      </p>
                    </div>

                    {/* Alternative Option */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        {imageFit === "cover" ? "Alternative: Fit/Full" : "Alternative: Fill/Crop"}
                      </p>
                      <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-300">
                        <Image
                          src={preview}
                          alt="Alternative preview"
                          fill
                          className={imageFit === "cover" ? "object-contain" : "object-cover"}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {imageFit === "cover" ? "Shows full image (may have gaps)" : "Fills entire frame (may crop edges)"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-900">
                      <strong>💡 Tip:</strong> The "Fill (Crop)" mode is recommended for uniform product images. 
                      It ensures all products look consistent in the grid layout.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Info */}
              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">File selected</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <Button
                className="w-full bg-blue-700 hover:bg-blue-800"
                onClick={handleUpload}
                disabled={!selectedProduct || !selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Instructions</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Select the product you want to upload an image for</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Click the upload area or drag and drop an image file (JPG, PNG, or WebP)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Preview your image and click "Upload Image"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>The image will be automatically uploaded to Supabase Storage and linked to the product</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">5.</span>
                <span>Changes will appear on the website immediately after deployment</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
