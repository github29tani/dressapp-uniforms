"use client"

import { useState, useEffect } from "react"
import { Upload, Trash2, Loader2, AlertCircle, Check, Image as ImageIcon, RefreshCw } from "lucide-react"
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
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
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(id,url,alt_text)")
      .order("name")
    setProducts((data ?? []) as Product[])
    setLoadingProducts(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB")
      return
    }

    setSelectedFile(file)
    setUploadError(null)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleUpload() {
    if (!selectedProduct || !selectedFile) {
      setUploadError("Please select a product and an image")
      return
    }

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const product = products.find(p => p.id === selectedProduct)
      if (!product) throw new Error("Product not found")

      const category = product.category as Category
      const fileName = `${category.slug}/${product.slug}-${Date.now()}.${selectedFile.name.split('.').pop()}`

      const formData = new FormData()
      formData.append('file', selectedFile)
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

      setUploadSuccess(`Image uploaded successfully for ${product.name}`)
      setSelectedFile(null)
      setPreview("")
      setSelectedProduct("")
      
      loadProducts()
      loadAllImages()

      setTimeout(() => setUploadSuccess(null), 3000)

    } catch (err: any) {
      console.error("Full error:", err)
      setUploadError(err.message || "Failed to upload image")
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
                    <Select value={selectedProduct} onValueChange={(value) => setSelectedProduct(value || "")}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose a product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingProducts ? (
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

                  {/* Current Image Warning */}
                  {selectedProductData && selectedProductData.images && selectedProductData.images.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">Product Already Has Image</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Uploading a new image will <strong>replace</strong> the existing one.
                          </p>
                        </div>
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
                          <div className="relative w-full h-full p-2">
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
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
          </TabsContent>

          {/* ===== MANAGE TAB ===== */}
          <TabsContent value="manage">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
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

                  <div className="flex items-center gap-3">
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
                    
                    <Button
                      onClick={deleteSelectedImages}
                      disabled={selectedImageIds.size === 0 || deletingImages}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {deletingImages ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Selected ({selectedImageIds.size})
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {manageSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium text-green-900">{manageSuccess}</p>
                    </div>
                  </div>
                )}

                {manageError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium text-red-900">{manageError}</p>
                    </div>
                  </div>
                )}
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
