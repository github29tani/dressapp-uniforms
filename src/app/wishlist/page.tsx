"use client"

import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { ProductCard } from "@/components/product/product-card"
import { useWishlistStore } from "@/store/wishlist-store"

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        My Wishlist {items.length > 0 && <span className="text-gray-400 font-normal text-lg">({items.length} items)</span>}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</p>
          <p className="text-gray-500 mb-6">Save items you love to buy them later.</p>
          <LinkButton href="/products" className="bg-blue-700 hover:bg-blue-800">
            Explore Products
          </LinkButton>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
