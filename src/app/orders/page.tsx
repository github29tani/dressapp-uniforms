"use client"

import { useEffect, useState } from "react"
import { Package, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils-shop"
import type { Order, OrderStatus } from "@/types"

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  placed:           { label: "Placed",           color: "bg-gray-100 text-gray-700" },
  confirmed:        { label: "Confirmed",         color: "bg-blue-100 text-blue-700" },
  packed:           { label: "Packed",            color: "bg-indigo-100 text-indigo-700" },
  shipped:          { label: "Shipped",           color: "bg-amber-100 text-amber-700" },
  out_for_delivery: { label: "Out for Delivery",  color: "bg-orange-100 text-orange-700" },
  delivered:        { label: "Delivered",         color: "bg-green-100 text-green-700" },
  cancelled:        { label: "Cancelled",         color: "bg-red-100 text-red-700" },
  return_requested: { label: "Return Requested",  color: "bg-yellow-100 text-yellow-700" },
  returned:         { label: "Returned",          color: "bg-gray-100 text-gray-500" },
}

const ORDER_STEPS: OrderStatus[] = [
  "placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered",
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from("orders")
        .select("*, items:order_items(id, quantity, unit_price, total_price, product:products(name, slug), variant:product_variants(size))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setOrders((data ?? []) as Order[])
      setLoading(false)
    })
  }, [])

  async function cancelOrder(id: string) {
    if (!confirm("Cancel this order?")) return
    const supabase = createClient()
    await supabase.from("orders").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", id)
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "cancelled" as OrderStatus } : o))
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No orders yet</p>
          <LinkButton href="/schools" className="bg-blue-700 hover:bg-blue-800">
            Start Shopping
          </LinkButton>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status]
            const currentStepIndex = ORDER_STEPS.indexOf(order.status)

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      <span className="font-bold text-gray-900 whitespace-nowrap">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Order items */}
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      {order.items.map((item) => {
                        const name = (item.product as { name?: string })?.name ?? "Product"
                        const size = (item.variant as { size?: string })?.size ?? ""
                        return (
                          <div key={item.id} className="flex justify-between text-sm text-gray-600">
                            <span className="line-clamp-1">{name}{size ? ` (Size ${size})` : ""} × {item.quantity}</span>
                            <span className="flex-shrink-0 ml-2">{formatPrice(item.total_price)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Progress tracker */}
                  {currentStepIndex >= 0 && (
                    <div className="overflow-x-auto mb-4">
                      <div className="flex items-center gap-1 min-w-max">
                        {ORDER_STEPS.map((s, i) => {
                          const done = i <= currentStepIndex
                          return (
                            <div key={s} className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${done ? "bg-blue-600" : "bg-gray-300"}`} />
                              <span className={`text-xs whitespace-nowrap ${done ? "text-blue-700 font-medium" : "text-gray-400"}`}>
                                {STATUS_CONFIG[s].label}
                              </span>
                              {i < ORDER_STEPS.length - 1 && (
                                <div className={`h-0.5 w-4 flex-shrink-0 ${i < currentStepIndex ? "bg-blue-600" : "bg-gray-200"}`} />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {order.status === "delivered" && (
                      <Button size="sm" className="bg-blue-700 hover:bg-blue-800">Reorder</Button>
                    )}
                    {order.status === "shipped" && (
                      <Button variant="outline" size="sm">Track Shipment</Button>
                    )}
                    {["placed", "confirmed"].includes(order.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => cancelOrder(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
