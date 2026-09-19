"use client"

import Link from "next/link"
import { Trash2, Minus, Plus, ShoppingBag, Tag, ArrowRight, Shirt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/store/cart-store"
import { formatPrice } from "@/lib/utils-shop"
import { useState } from "react"

// Sample coupons for demo (will be replaced with DB coupons)
const DEMO_COUPONS: Record<string, { discount_type: "percentage" | "fixed"; discount_value: number; min_order_amount?: number }> = {
  SCHOOL10: { discount_type: "percentage", discount_value: 10, min_order_amount: 50000 },
  FIRST50:  { discount_type: "fixed",      discount_value: 5000 },
  SAVE100:  { discount_type: "fixed",      discount_value: 10000, min_order_amount: 100000 },
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, applyCoupon, removeCoupon, coupon,
    getSubtotal, getDiscount, getTotal } = useCartStore()
  const [couponInput, setCouponInput] = useState("")
  const [couponError, setCouponError] = useState("")

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const deliveryCharge = subtotal - discount >= 499 ? 0 : 49
  const total = getTotal()

  function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase()
    const found = DEMO_COUPONS[code]
    if (!found) { setCouponError("Invalid coupon code."); return }
    if (found.min_order_amount && subtotal < found.min_order_amount) {
      setCouponError(`Minimum order of ${formatPrice(found.min_order_amount)} required.`)
      return
    }
    applyCoupon({
      id: code, code, is_active: true,
      discount_type: found.discount_type,
      discount_value: found.discount_value,
      min_order_amount: found.min_order_amount,
      usage_count: 0,
      created_at: new Date().toISOString(),
    })
    setCouponError("")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add items from the school uniform shop.</p>
        <LinkButton href="/schools" className="bg-blue-700 hover:bg-blue-800">
          Shop by School
        </LinkButton>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          {items.map((item) => {
            const price = item.product.discount_price ?? item.product.price
            const image = item.product.images[0]?.url
            return (
              <Card key={item.id}>
                <CardContent className="p-4 flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {image ? (
                      <img src={image} alt={item.product.name} className="absolute inset-0 w-full h-full object-contain" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <Shirt className="h-10 w-10" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium text-gray-900 hover:text-blue-700 line-clamp-2 text-sm"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">Size: {item.variant.size}</Badge>
                      <Badge variant="secondary" className="text-xs capitalize">{item.product.gender}</Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3 gap-2">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">
                          {formatPrice(price * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Continue shopping */}
          <Link href="/products" className="flex items-center gap-1 text-sm text-blue-700 hover:underline mt-2">
            <ArrowRight className="h-4 w-4 rotate-180" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card className="sticky top-20">
            <CardContent className="p-5 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

              {/* Coupon */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-2 text-green-700">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">{coupon.code} applied</span>
                    </div>
                    <button
                      onClick={() => { removeCoupon(); setCouponInput("") }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon code"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError("") }}
                        className="h-9 text-sm uppercase"
                      />
                      <Button variant="outline" size="sm" onClick={handleApplyCoupon} className="flex-shrink-0">
                        Apply
                      </Button>
                    </div>
                    {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                    <p className="text-xs text-gray-400">Try: SCHOOL10 · FIRST50 · SAVE100</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : formatPrice(deliveryCharge)}</span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-xs text-gray-400">
                    Add {formatPrice(499 - (subtotal - discount))} more for free delivery
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <LinkButton href="/checkout" className="w-full bg-blue-700 hover:bg-blue-800 h-11 flex items-center justify-center">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </LinkButton>

              <p className="text-xs text-center text-gray-400">
                Secure checkout powered by Razorpay
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
