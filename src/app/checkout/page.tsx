"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Truck, CreditCard, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart-store"
import { formatPrice } from "@/lib/utils-shop"
import { INDIAN_STATES } from "@/lib/mock-data"

type Step = "address" | "delivery" | "payment" | "confirmation"

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Delivery", days: "5-7 business days", price: 0 },
  { id: "express", label: "Express Delivery", days: "2-3 business days", price: 99 },
]

const PAYMENT_OPTIONS = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
  { id: "wallet", label: "Wallet", icon: "👛" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
]

export default function CheckoutPage() {
  const { items, getSubtotal, getDiscount, coupon, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>("address")
  const [delivery, setDelivery] = useState("standard")
  const [payment, setPayment] = useState("upi")
  const [orderNumber] = useState(`SK${Date.now().toString().slice(-8)}`)

  const subtotal = getSubtotal()
  const discount = getDiscount()
  const deliveryCharge = delivery === "express" ? 99 : subtotal - discount >= 499 ? 0 : 49
  const total = subtotal - discount + deliveryCharge

  const [address, setAddress] = useState({
    full_name: "", phone: "", address_line1: "", address_line2: "",
    city: "", state: "", pin_code: "",
  })

  const handleAddressChange = (field: string, value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }))

  function handlePlaceOrder() {
    clearCart()
    setStep("confirmation")
  }

  if (step === "confirmation") {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-1">Your order has been confirmed.</p>
        <p className="text-sm font-medium text-blue-700 mb-6">Order #{orderNumber}</p>

        <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 space-y-1.5 mb-6">
          <p>📦 Packed within 24 hours</p>
          <p>🚚 Estimated delivery in 5-7 business days</p>
          <p>📱 You'll receive SMS & email updates</p>
        </div>

        <div className="flex flex-col gap-3">
          <LinkButton href="/orders" className="bg-blue-700 hover:bg-blue-800 flex items-center justify-center">
            Track My Order
          </LinkButton>
          <LinkButton href="/" variant="outline" className="flex items-center justify-center">
            Continue Shopping
          </LinkButton>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <LinkButton href="/schools" className="bg-blue-700 hover:bg-blue-800">
          Shop by School
        </LinkButton>
      </div>
    )
  }

  const steps: { id: Step; label: string; icon: typeof MapPin }[] = [
    { id: "address", label: "Address", icon: MapPin },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
  ]

  const stepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back */}
      <Link href="/cart" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      {/* Step indicator */}
      <div className="overflow-x-auto -mx-4 px-4 mb-8">
        <div className="flex items-center gap-2 min-w-max">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full whitespace-nowrap ${
                i <= stepIndex ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-6 flex-shrink-0 ${i < stepIndex ? "bg-blue-700" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: step content */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {/* Step 1: Address */}
          {step === "address" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-700" /> Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="Rahul Sharma" className="mt-1"
                      value={address.full_name} onChange={(e) => handleAddressChange("full_name", e.target.value)} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" placeholder="9876543210" className="mt-1"
                      value={address.phone} onChange={(e) => handleAddressChange("phone", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="addr1">Address Line 1 *</Label>
                    <Input id="addr1" placeholder="House no., Street" className="mt-1"
                      value={address.address_line1} onChange={(e) => handleAddressChange("address_line1", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="addr2">Address Line 2</Label>
                    <Input id="addr2" placeholder="Area, Landmark (optional)" className="mt-1"
                      value={address.address_line2} onChange={(e) => handleAddressChange("address_line2", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="Delhi" className="mt-1"
                      value={address.city} onChange={(e) => handleAddressChange("city", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="pin">PIN Code *</Label>
                    <Input id="pin" placeholder="110001" className="mt-1" maxLength={6}
                      value={address.pin_code} onChange={(e) => handleAddressChange("pin_code", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={address.state} onValueChange={(v) => v && handleAddressChange("state", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-700 hover:bg-blue-800 h-11 mt-2"
                  onClick={() => setStep("delivery")}
                  disabled={!address.full_name || !address.phone || !address.address_line1 || !address.city || !address.pin_code || !address.state}
                >
                  Continue to Delivery
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Delivery */}
          {step === "delivery" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-700" /> Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {DELIVERY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setDelivery(opt.id)}
                    className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-colors ${
                      delivery === opt.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.days}</p>
                    </div>
                    <div className="text-right">
                      {opt.price === 0 ? (
                        <span className="text-green-600 font-semibold text-sm">FREE</span>
                      ) : (
                        <span className="font-semibold">{formatPrice(opt.price)}</span>
                      )}
                    </div>
                  </button>
                ))}
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("address")}>Back</Button>
                  <Button className="flex-1 bg-blue-700 hover:bg-blue-800" onClick={() => setStep("payment")}>
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-700" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPayment(opt.id)}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl transition-colors ${
                      payment === opt.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-medium text-gray-900">{opt.label}</span>
                  </button>
                ))}
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("delivery")}>Back</Button>
                  <Button className="flex-1 bg-blue-700 hover:bg-blue-800 h-11" onClick={handlePlaceOrder}>
                    Place Order · {formatPrice(total)}
                  </Button>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">
                  🔒 Secured by Razorpay. Your payment info is encrypted.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Items */}
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm gap-2">
                  <span className="text-gray-600 line-clamp-1 flex-1">
                    {item.product.name} × {item.quantity}
                    <span className="text-gray-400 ml-1">(Size {item.variant.size})</span>
                  </span>
                  <span className="font-medium flex-shrink-0">
                    {formatPrice((item.product.discount_price ?? item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span><span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : formatPrice(deliveryCharge)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>

              {coupon && (
                <Badge className="w-full justify-center bg-green-100 text-green-700 border-green-200">
                  Coupon {coupon.code} applied
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
