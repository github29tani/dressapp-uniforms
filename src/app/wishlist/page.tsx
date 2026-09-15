"use client"

import { Heart, Trash2, ShoppingCart } from "lucide-react"
import { LinkButton } from "@/components/ui/link-button"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product/product-card"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import type { Product } from "@/types"

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addItem = useCartStore((s) => s.addItem)

  function moveToCart(product: Product) {
    const firstAvailable = product.variants.find((v) => v.stock > 0)
    if (firstAvailable) {
      addItem(product, firstAvailable, 1)
      removeItem(product.id)
    }
  }

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
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              {/* Wishlist-specific action row */}
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-9 text-xs gap-1.5"
                  onClick={() => moveToCart(product)}
                  disabled={!product.variants.some((v) => v.stock > 0)}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Move to Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 w-9 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                  onClick={() => removeItem(product.id)}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
