"use client"

import { useState, useEffect } from "react"
import { Upload, Trash2, Loader2, AlertCircle, Check, Image as ImageIcon, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

interface OrphanedImage {
  id: string
  url: string
  product_id: string
  product_name: string
  category_name: string
}

export default function ImagesManagerPage() {
  const supabase = createClient()

  // Upload Tab State
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Manage Tab State
  const [images, setImages] = useState<ProductImageData[]>([])
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set())
  const [loadingImages, setLoadingImages] = useState(false)
  const [deletingImages, setDeletingImages] = useState(false)
  const [manageSuccess, setManageSuccess] = useState<string | null>(null)
  const [manageError, setManageError] = useState<string | null>(null)

  // Cleanup Tab State
  const [orphanedImages, setOrphanedImages] = useState<OrphanedImage[]>([])
  const [selectedOrphanIds, setSelectedOrphanIds] = useState<Set<string>>(new Set())
  const [loadingOrphans, setLoadingOrphans] = useState(false)
  const [cleaningOrphans, setCleaningOrphans] = useState(false)
  const [cleanupSuccess, setCleanupSuccess] = useState<string | null>(null)
  const [cleanupError, setCleanupError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
    loadAllImages()
    loadOrphanedImages()
  }, [])

  // ===== UPLOAD TAB FUNCTIONS =====
  async function loadProducts() {
    setLoadingProducts(true)
    console.log('Loading products...')
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*), images:product_images(id,url,alt_text)")
        .order("name")
      
      if (error) {
        console.error('Error loading products:', error)
        setUploadError(`Failed to load products: ${error.message}`)
      } else {
        console.log(`Loaded ${data?.length || 0} products:`, data)
        setProducts((data ?? []) as Product[])
      }
    } catch (err) {
      console.error('Exception loading products:', err)
      setUploadError('Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    console.log(`Selected ${files.length} files`)
    
    if (files.length === 0) {
      console.log('No files selected')
      return
    }

    setUploadError(null)
    const validFiles: File[] = []
    const invalidFiles: string[] = []
    let loadedPreviews = 0

    files.forEach(file => {
      console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`)
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name} (not an image)`)
        console.log(`Rejected ${file.name}: not an image`)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large, max 5MB)`)
        console.log(`Rejected ${file.name}: too large`)
        return
      }

      validFiles.push(file)
      console.log(`Accepted ${file.name}`)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        loadedPreviews++
        console.log(`Preview loaded for ${file.name} (${loadedPreviews}/${validFiles.length})`)
        
        setPreviews(prev => [...prev, reader.result as string])
        
        if (loadedPreviews === validFiles.length) {
          console.log('All previews loaded')
        }
      }
      reader.onerror = () => {
        console.error(`Failed to read ${file.name}`)
      }
      reader.readAsDataURL(file)
    })

    if (validFiles.length > 0) {
      setSelectedFiles(prev => {
        const updated = [...prev, ...validFiles]
        console.log(`Total files selected: ${updated.length}`)
        return updated
      })
    }

    if (invalidFiles.length > 0) {
      setUploadError(`Skipped ${invalidFiles.length} file(s): ${invalidFiles.join(', ')}`)
    }
    
    // Reset input so same files can be selected again if needed
    e.target.value = ''
    console.log('File input reset')
  }

  function removePreview(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function movePreview(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= selectedFiles.length) return

    const newFiles = [...selectedFiles]
    const newPreviews = [...previews]

    const [movedFile] = newFiles.splice(fromIndex, 1)
    const [movedPreview] = newPreviews.splice(fromIndex, 1)

    newFiles.splice(toIndex, 0, movedFile)
    newPreviews.splice(toIndex, 0, movedPreview)

    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
  }

  async function handleUpload() {
    if (!selectedProduct || selectedFiles.length === 0) {
      setUploadError("Please select a product and at least one image")
      return
    }

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const product = products.find(p => p.id === selectedProduct)
      if (!product) throw new Error("Product not found")

      const category = product.category as Category
      let uploadedCount = 0
      let failedCount = 0

      for (const file of selectedFiles) {
        try {
          const fileName = `${category.slug}/${product.slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`

          const formData = new FormData()
          formData.append('file', file)
          formData.append('productId', selectedProduct)
          formData.append('fileName', fileName)
          formData.append('objectFit', 'contain')

          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
          })

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.error || 'Upload failed')
          }

          uploadedCount++
        } catch (err) {
          console.error('Failed to upload file:', err)
          failedCount++
        }
      }

      if (uploadedCount > 0) {
        setUploadSuccess(`Successfully uploaded ${uploadedCount} image${uploadedCount !== 1 ? 's' : ''} for ${product.name}${failedCount > 0 ? ` (${failedCount} failed)` : ''}`)
        setSelectedFiles([])
        setPreviews([])
        setSelectedProduct("")
        
        loadProducts()
        loadAllImages()

        setTimeout(() => setUploadSuccess(null), 3000)
      } else {
        setUploadError("Failed to upload images")
      }

    } catch (err: any) {
      console.error("Upload error:", err)
      setUploadError(err.message || "Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  // ===== MANAGE TAB FUNCTIONS =====
  async function loadAllImages() {
    setLoadingImages(true)
    setManageError(null)
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
      setManageError(err.message || 'Failed to load images')
    } finally {
      setLoadingImages(false)
    }
  }

  function toggleImageSelect(id: string) {
    setSelectedImageIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  function toggleSelectAllImages() {
    if (selectedImageIds.size === images.length) {
      setSelectedImageIds(new Set())
    } else {
      setSelectedImageIds(new Set(images.map(img => img.id)))
    }
  }

  async function deleteSelectedImages() {
    if (selectedImageIds.size === 0) return

    if (!confirm(`Delete ${selectedImageIds.size} image${selectedImageIds.size !== 1 ? 's' : ''}? This will delete both files and database records.`)) {
      return
    }

    setDeletingImages(true)
    setManageError(null)
    setManageSuccess(null)

    try {
      const selectedImages = images.filter(img => selectedImageIds.has(img.id))
      let deletedCount = 0

      for (const image of selectedImages) {
        try {
          const urlParts = image.url.split('/product-images/')
          if (urlParts.length >= 2) {
            const filePath = urlParts[1]
            await supabase.storage.from('product-images').remove([filePath])
          }

          const { error: dbError } = await supabase
            .from('product_images')
            .delete()
            .eq('id', image.id)

          if (dbError) throw dbError
          deletedCount++
        } catch (err) {
          console.error(`Failed to delete image ${image.id}:`, err)
        }
      }

      setManageSuccess(`Successfully deleted ${deletedCount} image${deletedCount !== 1 ? 's' : ''}`)
      setSelectedImageIds(new Set())
      loadAllImages()
      loadProducts()
      setTimeout(() => setManageSuccess(null), 3000)

    } catch (err: any) {
      console.error('Error deleting images:', err)
      setManageError(err.message || 'Failed to delete images')
    } finally {
      setDeletingImages(false)
    }
  }

  // ===== CLEANUP TAB FUNCTIONS =====
  async function loadOrphanedImages() {
    setLoadingOrphans(true)
    try {
      const { data: images } = await supabase
        .from("product_images")
        .select("id, url, product_id, created_at, products(name, category:categories(name))")
        .order("created_at", { ascending: false })

      if (!images) {
        setOrphanedImages([])
        setLoadingOrphans(false)
        return
      }

      const orphaned: OrphanedImage[] = []
      
      for (const image of images) {
        const urlParts = image.url.split('/product-images/')
        if (urlParts.length < 2) continue
        
        const filePath = urlParts[1]
        
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('product-images')
          .list(filePath.split('/').slice(0, -1).join('/'), {
            search: filePath.split('/').pop()
          })

        if (!fileData || fileData.length === 0 || fileError) {
          orphaned.push({
            id: image.id,
            url: image.url,
            product_id: image.product_id,
            product_name: (image as any).products?.name || 'Unknown Product',
            category_name: (image as any).products?.category?.name || 'Unknown Category'
          })
        }
      }

      setOrphanedImages(orphaned)
    } catch (err) {
      console.error('Error loading images:', err)
      setCleanupError('Failed to load orphaned images')
    } finally {
      setLoadingOrphans(false)
    }
  }

  function toggleOrphanSelect(id: string) {
    setSelectedOrphanIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  function toggleSelectAllOrphans() {
    if (selectedOrphanIds.size === orphanedImages.length) {
      setSelectedOrphanIds(new Set())
    } else {
      setSelectedOrphanIds(new Set(orphanedImages.map(img => img.id)))
    }
  }

  async function deleteSelectedOrphans() {
    if (selectedOrphanIds.size === 0) return

    if (!confirm(`Delete ${selectedOrphanIds.size} orphaned record${selectedOrphanIds.size !== 1 ? 's' : ''}?`)) {
      return
    }

    setCleaningOrphans(true)
    setCleanupError(null)
    setCleanupSuccess(null)

    try {
      const ids = Array.from(selectedOrphanIds)
      
      const { error: deleteError } = await supabase
        .from('product_images')
        .delete()
        .in('id', ids)

      if (deleteError) throw deleteError

      setCleanupSuccess(`Successfully deleted ${ids.length} orphaned record${ids.length !== 1 ? 's' : ''}`)
      setOrphanedImages(prev => prev.filter(img => !selectedOrphanIds.has(img.id)))
      setSelectedOrphanIds(new Set())
      
      setTimeout(() => setCleanupSuccess(null), 2000)

    } catch (err: any) {
      console.error('Error deleting orphaned images:', err)
      setCleanupError(err.message || 'Failed to delete orphaned images')
    } finally {
      setCleaningOrphans(false)
    }
  }

  const selectedProductData = products.find(p => p.id === selectedProduct)
  const allImagesSelected = images.length > 0 && selectedImageIds.size === images.length
  const allOrphansSelected = orphanedImages.length > 0 && selectedOrphanIds.size === orphanedImages.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-blue-700" />
          <span className="font-bold text-gray-900">Image Management</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upload">Upload Images</TabsTrigger>
            <TabsTrigger value="manage">Manage Images ({images.length})</TabsTrigger>
            <TabsTrigger value="cleanup">Cleanup Orphaned ({orphanedImages.length})</TabsTrigger>
          </TabsList>

          {/* ===== UPLOAD TAB ===== */}
          <TabsContent value="upload">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-6">Upload Product Image</h2>
                
                <div className="space-y-6">
                  {/* Product Selection */}
                  <div>
                    <Label htmlFor="product">Select Product *</Label>
                    {loadingProducts ? (
                      <div className="mt-2 flex items-center justify-center h-10 border rounded-lg bg-gray-50">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">Loading products...</span>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-amber-900">No Products Found</p>
                            <p className="text-xs text-amber-700 mt-1">
                              Please create products first before uploading images.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Select value={selectedProduct} onValueChange={(value) => setSelectedProduct(value || "")}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Choose a product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {(product.category as Category)?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Current Images Display */}
                  {selectedProductData && selectedProductData.images && selectedProductData.images.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900">
                            Product has {selectedProductData.images.length} image{selectedProductData.images.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            You can add more images. Multiple images per product are supported.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedProductData.images.slice(0, 3).map((img: any, idx: number) => (
                          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-300">
                            <img
                              src={img.url}
                              alt={selectedProductData.name}
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                      {selectedProductData.images.length > 3 && (
                        <p className="text-xs text-blue-600 mt-2 text-center">
                          +{selectedProductData.images.length - 3} more image{selectedProductData.images.length - 3 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}

                  {/* File Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="file">Select Image Files *</Label>
                      <div className="bg-blue-50 border border-blue-200 rounded px-3 py-1">
                        <p className="text-xs text-blue-700 font-medium">
                          💡 Hold <kbd className="bg-white px-1.5 py-0.5 rounded text-xs border border-blue-300">Ctrl</kbd> or <kbd className="bg-white px-1.5 py-0.5 rounded text-xs border border-blue-300">Cmd</kbd> to select multiple files
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 space-y-3">
                      <label
                        htmlFor="file"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors hover:border-blue-400"
                      >
                        <div className="flex flex-col items-center justify-center py-6">
                          <Upload className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600 mb-1 font-semibold">Click to select images</p>
                          <p className="text-xs text-gray-400 mb-2">PNG, JPG or WebP (max 5MB each)</p>
                          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                            <p className="text-xs font-semibold">📁 Select multiple images using Ctrl/Cmd + Click</p>
                          </div>
                          {selectedFiles.length > 0 && (
                            <div className="mt-3 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                              <p className="text-xs font-bold">✓ {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''} ready to upload</p>
                            </div>
                          )}
                        </div>
                        <input
                          id="file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="text-xs text-center text-gray-500">
                        Click multiple times to keep adding more images • Or select all at once with Ctrl/Cmd
                      </p>
                    </div>
                  </div>

                  {/* Image Previews with Reorder & Remove */}
                  {previews.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>Selected Images ({previews.length})</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFiles([])
                            setPreviews([])
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Clear All
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {previews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-contain"
                            />

                            {/* Order badge */}
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                              {index + 1}
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removePreview(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              title="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>

                            {/* Reorder buttons */}
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => movePreview(index, index - 1)}
                                disabled={index === 0}
                                className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded shadow hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move left"
                              >
                                ←
                              </button>
                              <button
                                type="button"
                                onClick={() => movePreview(index, index + 1)}
                                disabled={index === previews.length - 1}
                                className="px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded shadow hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move right"
                              >
                                →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-900">
                          <strong>💡 Tip:</strong> The order shown here will be the order displayed on the website. 
                          Hover over images to reorder them. Click X to remove an image.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Success/Error Messages */}
                  {uploadSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5" />
                        <p className="text-sm font-medium text-green-900">{uploadSuccess}</p>
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <p className="text-sm font-medium text-red-900">{uploadError}</p>
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <Button
                    className="w-full bg-blue-700 hover:bg-blue-800"
                    onClick={handleUpload}
                    disabled={!selectedProduct || selectedFiles.length === 0 || uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''}...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}` : 'Images'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== MANAGE TAB ===== */}
          <TabsContent value="manage">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header with counts */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-sm text-gray-600">
                        {loadingImages ? 'Loading...' : `${images.length} image${images.length !== 1 ? 's' : ''} total`}
                      </p>
                      {selectedImageIds.size > 0 && (
                        <p className="text-sm font-semibold text-blue-700">
                          {selectedImageIds.size} selected
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadAllImages}
                        disabled={loadingImages}
                      >
                        <RefreshCw className={`h-4 w-4 ${loadingImages ? 'animate-spin' : ''}`} />
                      </Button>

                      {images.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleSelectAllImages}
                        >
                          {allImagesSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Delete button - prominent and separate */}
                  {selectedImageIds.size > 0 && (
                    <div className="border-t pt-4">
                      <Button
                        onClick={deleteSelectedImages}
                        disabled={deletingImages}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                      >
                        {deletingImages ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Deleting {selectedImageIds.size} image{selectedImageIds.size !== 1 ? 's' : ''}...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-5 w-5 mr-2" />
                            Delete {selectedImageIds.size} Selected Image{selectedImageIds.size !== 1 ? 's' : ''}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Success/Error Messages */}
                  {manageSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-green-900">{manageSuccess}</p>
                      </div>
                    </div>
                  )}

                  {manageError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-red-900">{manageError}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {loadingImages ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
              </div>
            ) : images.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Found</h3>
                  <p className="text-gray-500">Upload product images to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((image) => (
                  <Card 
                    key={image.id} 
                    className={`overflow-hidden cursor-pointer transition-all ${
                      selectedImageIds.has(image.id) ? 'ring-2 ring-blue-500 shadow-lg' : ''
                    }`}
                    onClick={() => toggleImageSelect(image.id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/5] bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.product_name}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                        
                        <div className="absolute top-2 left-2">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            selectedImageIds.has(image.id)
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-white/90 border-gray-300'
                          }`}>
                            {selectedImageIds.has(image.id) && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      </div>

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
          </TabsContent>

          {/* ===== CLEANUP TAB ===== */}
          <TabsContent value="cleanup">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <AlertCircle className="h-6 w-6 text-orange-600 mt-1 shrink-0" />
                  <div>
                    <h2 className="font-semibold text-lg mb-2">Orphaned Image Records</h2>
                    <p className="text-sm text-gray-600 mb-3">
                      These are database records where the actual file has been deleted from storage.
                      Products will show broken images until these records are removed.
                    </p>
                  </div>
                </div>

                {loadingOrphans ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
                    <span className="ml-3 text-gray-600">Checking for orphaned images...</span>
                  </div>
                ) : orphanedImages.length === 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-900">
                        ✓ No orphaned records found. Database is clean!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-orange-900 mb-1">
                        Found {orphanedImages.length} orphaned record{orphanedImages.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-orange-700">
                        These records reference files that no longer exist in storage
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSelectAllOrphans}
                      >
                        {allOrphansSelected ? 'Deselect All' : 'Select All'}
                      </Button>

                      <Button
                        onClick={deleteSelectedOrphans}
                        disabled={selectedOrphanIds.size === 0 || cleaningOrphans}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {cleaningOrphans ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Selected ({selectedOrphanIds.size})
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {cleanupSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm font-medium text-green-900">{cleanupSuccess}</p>
                    </div>
                  </div>
                )}

                {cleanupError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <p className="text-sm font-medium text-red-900">{cleanupError}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {orphanedImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {orphanedImages.map((image) => (
                  <Card 
                    key={image.id} 
                    className={`overflow-hidden cursor-pointer transition-all ${
                      selectedOrphanIds.has(image.id) ? 'ring-2 ring-red-500 shadow-lg' : ''
                    }`}
                    onClick={() => toggleOrphanSelect(image.id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/5] bg-gray-100 flex items-center justify-center">
                        <div className="text-center p-4">
                          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs text-gray-400">File missing</p>
                        </div>
                        
                        <div className="absolute top-2 left-2">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            selectedOrphanIds.has(image.id)
                              ? 'bg-red-600 border-red-600'
                              : 'bg-white/90 border-gray-300'
                          }`}>
                            {selectedOrphanIds.has(image.id) && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>

                        <div className="absolute top-2 right-2">
                          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            ORPHANED
                          </span>
                        </div>
                      </div>

                      <div className="p-3 border-t">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                          {image.product_name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{image.category_name}</p>
                        <p className="text-xs text-gray-400 truncate" title={image.url}>
                          {image.url.split('/').pop()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
