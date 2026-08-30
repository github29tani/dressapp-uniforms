"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  ArrowLeft, Star, Heart, ShoppingCart, Package, RefreshCw, Shield,
  Minus, Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { formatPrice, discountPercent } from "@/lib/utils-shop"
import type { ProductVariant } from "@/types"

interface Props {
  params: Promise<{ slug: string }>
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params)
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug)
  if (!product) notFound()

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product!.variants.find((v) => v.stock > 0) ?? null
  )
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const addItem = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product!.id)

  const discount = discountPercent(product!.price, product!.discount_price)
  const price = product!.discount_price ?? product!.price

  function handleAddToCart() {
    if (!selectedVariant || !product) return
    addItem(product, selectedVariant, quantity)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-blue-700 shrink-0">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-700 shrink-0">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category?.slug}`} className="hover:text-blue-700 shrink-0">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ─── Gallery ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {product.images[activeImage]?.url ? (
              <Image
                src={product.images[activeImage].url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <ShoppingCart className="h-20 w-20" />
              </div>
            )}
            {discount > 0 && (
              <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                    activeImage === i ? "border-blue-600" : "border-gray-200"
                  }`}
                >
                  <Image src={img.url} alt={`View ${i + 1}`} width={64} height={64} className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Product Info ─────────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500 capitalize">{product.gender} · {product.category?.name}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(product.rating!)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.review_count} reviews)</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>
            {product.discount_price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Save {formatPrice(product.price - product.discount_price)}
                </Badge>
              </>
            )}
          </div>

          <Separator />

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">Select Size</Label>
              <button className="text-sm text-blue-700 hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => v.stock > 0 && setSelectedVariant(v)}
                  disabled={v.stock === 0}
                  className={`min-w-[44px] h-11 px-3 border rounded-lg text-sm font-medium transition-all ${
                    selectedVariant?.id === v.id
                      ? "border-blue-700 bg-blue-700 text-white"
                      : v.stock === 0
                      ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                      : "border-gray-300 text-gray-700 hover:border-blue-500"
                  }`}
                >
                  {v.size}
                  {v.stock === 0 && <span className="ml-1 text-xs">(OOS)</span>}
                </button>
              ))}
            </div>
            {selectedVariant && selectedVariant.stock <= 5 && (
              <p className="text-sm text-orange-600 mt-2">
                Only {selectedVariant.stock} left in stock!
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <Label className="font-semibold block mb-2">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock ?? 10, q + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-blue-700 hover:bg-blue-800 h-12"
              onClick={handleAddToCart}
              disabled={!selectedVariant}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`h-12 w-12 ${wishlisted ? "border-red-300 text-red-500" : ""}`}
              onClick={() => toggle(product)}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>

          {/* Delivery info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm text-gray-600">
            {[
              { icon: Truck, text: "Free delivery on orders above ₹499" },
              { icon: RefreshCw, text: "7-day exchange for size issues" },
              { icon: Shield, text: "100% authentic, school-approved products" },
              { icon: Package, text: "Packed securely before dispatch" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Description & Reviews ─────────────────────────────────── */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.review_count ?? 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4 prose prose-sm max-w-none text-gray-600">
            <p>{product.description ?? "No description available."}</p>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="text-center py-8 text-gray-500">
              <Star className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>Reviews coming soon. Be the first to review this product.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Re-use Label inline
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium text-gray-700 ${className ?? ""}`}>{children}</label>
}

function Truck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
      <rect x="9" y="11" width="14" height="10" rx="2" />
      <circle cx="12" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
    </svg>
  )
}
