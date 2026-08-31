"use client"

import { useState } from "react"
import { CheckSquare, Square, ShoppingCart, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import { formatPrice } from "@/lib/utils-shop"
import type { UniformKit, ProductVariant } from "@/types"

interface UniformKitBuilderProps {
  kit: UniformKit
}

export function UniformKitBuilder({ kit }: UniformKitBuilderProps) {
  const addItem = useCartStore((s) => s.addItem)

  // Track selected state and chosen size per item
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(kit.items.map((i) => [i.id, i.is_required]))
  )
  const [sizes, setSizes] = useState<Record<string, ProductVariant | null>>(
    Object.fromEntries(kit.items.map((i) => {
      const firstAvailable = i.product.variants.find((v) => v.stock > 0) ?? null
      return [i.id, firstAvailable]
    }))
  )

  const selectedItems = kit.items.filter((i) => selected[i.id])

  const subtotal = selectedItems.reduce((sum, i) => {
    const price = i.product.discount_price ?? i.product.price
    return sum + price
  }, 0)

  const originalTotal = kit.items.reduce((sum, i) => {
    return sum + i.product.price
  }, 0)

  const kitDiscount = kit.items.length >= 5 ? Math.round(subtotal * 0.06) : 0

  function toggleItem(kitItemId: string) {
    setSelected((prev) => ({ ...prev, [kitItemId]: !prev[kitItemId] }))
  }

  function selectSize(kitItemId: string, variant: ProductVariant) {
    setSizes((prev) => ({ ...prev, [kitItemId]: variant }))
  }

  function addAllToCart() {
    selectedItems.forEach((item) => {
      const variant = sizes[item.id]
      if (variant) {
        addItem(item.product, variant, 1)
      }
    })
  }

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-700" />
            Complete Uniform Kit
          </CardTitle>
          {kitDiscount > 0 && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Tag className="h-3 w-3 mr-1" />
              Kit discount applied
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{kit.name}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {kit.items.map((item) => {
          const isSelected = selected[item.id]
          const price = item.product.discount_price ?? item.product.price
          const availableVariants = item.product.variants.filter((v) => v.stock > 0)

          return (
            <div
              key={item.id}
              className={`rounded-lg border p-3 transition-colors ${
                isSelected ? "border-blue-200 bg-blue-50/50" : "border-gray-200 bg-gray-50/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  disabled={item.is_required}
                  className="mt-0.5 flex-shrink-0"
                  aria-label={isSelected ? "Deselect item" : "Select item"}
                >
                  {isSelected ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="font-semibold text-sm text-gray-900 flex-shrink-0">
                      {formatPrice(price)}
                    </p>
                  </div>

                  {item.is_required && (
                    <Badge variant="secondary" className="text-xs mt-1">Required</Badge>
                  )}

                  {/* Size selector */}
                  {isSelected && availableVariants.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {availableVariants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => selectSize(item.id, v)}
                          className={`text-xs px-2 py-0.5 border rounded transition-colors ${
                            sizes[item.id]?.id === v.id
                              ? "bg-blue-700 text-white border-blue-700"
                              : "border-gray-300 text-gray-700 hover:border-blue-400"
                          }`}
                        >
                          {v.size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <Separator />

        {/* Totals */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({selectedItems.length} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {kitDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Kit discount (6%)</span>
              <span>-{formatPrice(kitDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t">
            <span>Total</span>
            <span>{formatPrice(subtotal - kitDiscount)}</span>
          </div>
        </div>

        <Button
          className="w-full bg-blue-700 hover:bg-blue-800 h-11"
          onClick={addAllToCart}
          disabled={selectedItems.length === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add {selectedItems.length} items to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
