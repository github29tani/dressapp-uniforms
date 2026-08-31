"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Star, Heart, ShoppingCart, Package, RefreshCw, Shield, Minus, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, discountPercent } from "@/lib/utils-shop"
import type { Product, ProductVariant } from "@/types"

interface Props { params: Promise<{ slug: string }> }

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const addItem = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(id,url,alt_text,sort_order), variants:product_variants(id,size,sku,price,stock)")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        if (!data) { setLoading(false); return }
        const p = {
          ...data,
          images: (data.images ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
        } as Product
        setProduct(p)
        setSelectedVariant(p.variants.find((v) => v.stock > 0) ?? null)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
  if (!product) notFound()
  
  const p = product!

  const wishlisted = isWishlisted(p.id)
  const discount = discountPercent(p.price, p.discount_price)
  const price = p.discount_price ?? p.price

  function handleAddToCart() {
    if (!selectedVariant) return
    addItem(p, selectedVariant, quantity)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-blue-700 shrink-0">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-700 shrink-0">Products</Link>
        {product.category && (<><span>/</span><Link href={`/products?category=${product.category.slug}`} className="hover:text-blue-700 shrink-0">{product.category.name}</Link></>)}
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {p.images[activeImage]?.url ? (
              <Image src={p.images[activeImage].url} alt={p.name} fill className="object-cover" priority />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300"><ShoppingCart className="h-20 w-20" /></div>
            )}
            {discount > 0 && <Badge className="absolute top-3 left-3 bg-emerald-500 text-white">{discount}% OFF</Badge>}
          </div>
          {p.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {p.images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImage(i)} className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${activeImage === i ? "border-blue-600" : "border-gray-200"}`}>
                  <Image src={img.url} alt={`View ${i + 1}`} width={64} height={64} className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500 capitalize">{p.gender} · {p.category?.name}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{p.name}</h1>
            {p.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">{[1,2,3,4,5].map((s) => (<Star key={s} className={`h-4 w-4 ${s <= Math.round(p.rating!) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />))}</div>
                <span className="text-sm font-medium">{p.rating}</span>
                <span className="text-sm text-gray-400">({p.review_count} reviews)</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>
            {p.discount_price && (<><span className="text-lg text-gray-400 line-through">{formatPrice(p.price)}</span><Badge className="bg-green-100 text-green-700 border-green-200">Save {formatPrice(p.price - p.discount_price)}</Badge></>)}
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Select Size</label>
              <button className="text-sm text-blue-700 hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.variants.map((v) => (
                <button key={v.id} onClick={() => v.stock > 0 && setSelectedVariant(v)} disabled={v.stock === 0}
                  className={`min-w-[44px] h-11 px-3 border rounded-lg text-sm font-medium transition-all ${selectedVariant?.id === v.id ? "border-blue-700 bg-blue-700 text-white" : v.stock === 0 ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50" : "border-gray-300 text-gray-700 hover:border-blue-500"}`}>
                  {v.size}{v.stock === 0 && <span className="ml-1 text-xs">(OOS)</span>}
                </button>
              ))}
            </div>
            {selectedVariant && selectedVariant.stock <= 5 && <p className="text-sm text-orange-600 mt-2">Only {selectedVariant.stock} left!</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock ?? 10, q + 1))}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="flex-1 bg-blue-700 hover:bg-blue-800 h-12" onClick={handleAddToCart} disabled={!selectedVariant}>
              <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className={`h-12 w-12 ${wishlisted ? "border-red-300 text-red-500" : ""}`} onClick={() => toggle(p)} aria-label="Toggle wishlist">
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm text-gray-600">
            {[
              { icon: Truck, text: "Free delivery on orders above ₹499" },
              { icon: RefreshCw, text: "7-day exchange for size issues" },
              { icon: Shield, text: "100% authentic, school-approved products" },
              { icon: Package, text: "Packed securely before dispatch" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2"><Icon className="h-4 w-4 text-blue-600 flex-shrink-0" /><span>{text}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList><TabsTrigger value="description">Description</TabsTrigger><TabsTrigger value="reviews">Reviews ({p.review_count ?? 0})</TabsTrigger></TabsList>
          <TabsContent value="description" className="mt-4 text-gray-600 text-sm leading-relaxed"><p>{p.description ?? "No description available."}</p></TabsContent>
          <TabsContent value="reviews" className="mt-4"><div className="text-center py-8 text-gray-500"><Star className="h-8 w-8 mx-auto mb-2 text-gray-300" /><p>Reviews coming soon.</p></div></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Truck(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" /><rect x="9" y="11" width="14" height="10" rx="2" /><circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
}
