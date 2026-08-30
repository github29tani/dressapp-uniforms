"use client"

import Link from "next/link"
import { Package, ChevronRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Card, CardContent } from "@/components/ui/card"
import type { OrderStatus } from "@/types"
import { formatPrice } from "@/lib/utils-shop"

// Demo orders
const DEMO_ORDERS = [
  {
    id: "o1",
    order_number: "SK20241101",
    status: "delivered" as OrderStatus,
    created_at: "2024-11-01",
    total: 4200,
    items: [
      { name: "DPS White School Shirt", size: "32", qty: 2, price: 449 },
      { name: "DPS Navy Blue Trousers", size: "30", qty: 1, price: 649 },
      { name: "DPS School Tie", size: "Standard", qty: 1, price: 199 },
    ],
  },
  {
    id: "o2",
    order_number: "SK20241205",
    status: "shipped" as OrderStatus,
    created_at: "2024-12-05",
    total: 1999,
    items: [
      { name: "DPS Navy Blazer", size: "34", qty: 1, price: 1299 },
      { name: "White Cotton School Socks", size: "M (5-8)", qty: 2, price: 99 },
    ],
  },
]

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  placed: { label: "Placed", color: "bg-gray-100 text-gray-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  packed: { label: "Packed", color: "bg-indigo-100 text-indigo-700" },
  shipped: { label: "Shipped", color: "bg-amber-100 text-amber-700" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-100 text-orange-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  return_requested: { label: "Return Requested", color: "bg-yellow-100 text-yellow-700" },
  returned: { label: "Returned", color: "bg-gray-100 text-gray-500" },
}

const ORDER_STEPS: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"]

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {DEMO_ORDERS.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No orders yet</p>
          <LinkButton href="/schools" className="bg-blue-700 hover:bg-blue-800">
            Start Shopping
          </LinkButton>
        </div>
      ) : (
        <div className="space-y-4">
          {DEMO_ORDERS.map((order) => {
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
                          day: "numeric", month: "short", year: "numeric"
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
                  <div className="space-y-1.5 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-600">
                        <span className="line-clamp-1">{item.name} (Size {item.size}) × {item.qty}</span>
                        <span className="flex-shrink-0 ml-2">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress tracker */}
                  {currentStepIndex >= 0 && (
                    <div className="overflow-x-auto">
                      <div className="flex items-center gap-1 min-w-max mb-4">
                        {ORDER_STEPS.map((s, i) => {
                          const done = i <= currentStepIndex
                          const cfg = STATUS_CONFIG[s]
                          return (
                            <div key={s} className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${done ? "bg-blue-600" : "bg-gray-300"}`} />
                              <span className={`text-xs whitespace-nowrap ${done ? "text-blue-700 font-medium" : "text-gray-400"}`}>
                                {cfg.label}
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
                      <>
                        <Button variant="outline" size="sm">Return / Exchange</Button>
                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800">Reorder</Button>
                      </>
                    )}
                    {order.status === "shipped" && (
                      <Button variant="outline" size="sm">Track Shipment</Button>
                    )}
                    {["placed", "confirmed"].includes(order.status) && (
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200">Cancel Order</Button>
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
