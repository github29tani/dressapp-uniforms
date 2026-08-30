"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import type { Product } from "@/types"
import { formatPrice, discountPercent } from "@/lib/utils-shop"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  const firstAvailableVariant = product.variants.find((v) => v.stock > 0)
  const discount = discountPercent(product.price, product.discount_price)
  const image = product.images[0]?.url

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!firstAvailableVariant) return
    addItem(product, firstAvailableVariant, 1)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col">

        {/* Image area */}
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-gray-200" />
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            )}
            {!firstAvailableVariant && (
              <span className="bg-gray-800/70 text-white text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                Sold out
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
              }`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-3.5 flex flex-col flex-1 gap-2">
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide mb-0.5 capitalize">
              {product.gender}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-3 w-3 ${
                      s <= Math.round(product.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.review_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-gray-900">
              {formatPrice(product.discount_price ?? product.price)}
            </span>
            {product.discount_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Sizes */}
          {product.variants.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 5).map((v) => (
                <span
                  key={v.id}
                  className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
                    v.stock > 0
                      ? "bg-gray-100 text-gray-600"
                      : "bg-gray-50 text-gray-300 line-through"
                  }`}
                >
                  {v.size}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!firstAvailableVariant}
            className={`mt-1 w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              firstAvailableVariant
                ? "bg-blue-700 hover:bg-blue-800 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {firstAvailableVariant ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </Link>
  )
}
