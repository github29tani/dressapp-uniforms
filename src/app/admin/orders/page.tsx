"use client"

import { useState } from "react"
import { Search, ShoppingBag, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils-shop"
import type { OrderStatus } from "@/types"

const DEMO_ORDERS = [
  { id: "SK20241210", customer: "Priya Sharma", phone: "9876543210", school: "DPS Greater Noida", items: 5, amount: 4200, status: "confirmed" as OrderStatus, date: "2024-12-10" },
  { id: "SK20241209", customer: "Rahul Gupta", phone: "9812345678", school: "Ryan International", items: 1, amount: 1499, status: "shipped" as OrderStatus, date: "2024-12-09" },
  { id: "SK20241209", customer: "Neha Verma", phone: "9898989898", school: "Amity Gurugram", items: 3, amount: 2850, status: "placed" as OrderStatus, date: "2024-12-09" },
  { id: "SK20241208", customer: "Amit Kumar", phone: "9011223344", school: "Kendriya Vidyalaya", items: 1, amount: 699, status: "delivered" as OrderStatus, date: "2024-12-08" },
  { id: "SK20241208", customer: "Sunita Singh", phone: "9922334455", school: "Modern School", items: 4, amount: 3100, status: "packed" as OrderStatus, date: "2024-12-08" },
  { id: "SK20241207", customer: "Deepak Joshi", phone: "9844332211", school: "DPS Greater Noida", items: 2, amount: 1299, status: "return_requested" as OrderStatus, date: "2024-12-07" },
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

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "confirmed",
  confirmed: "packed",
  packed: "shipped",
  shipped: "out_for_delivery",
  out_for_delivery: "delivered",
}

export default function AdminOrdersPage() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [orders, setOrders] = useState(DEMO_ORDERS)

  const filtered = orders.filter((o) => {
    const matchesQuery =
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.customer.toLowerCase().includes(query.toLowerCase()) ||
      o.school.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    return matchesQuery && matchesStatus
  })

  function advanceStatus(orderId: string, currentStatus: OrderStatus) {
    const next = NEXT_STATUS[currentStatus]
    if (!next) return
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-blue-700" />
          <span className="font-bold text-gray-900">Order Management</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search by order ID, customer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Orders", value: orders.length },
            { label: "Pending", value: orders.filter((o) => ["placed", "confirmed"].includes(o.status)).length },
            { label: "In Transit", value: orders.filter((o) => ["packed", "shipped", "out_for_delivery"].includes(o.status)).length },
            { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-y">
                  <tr>
                    {["Order ID", "Customer", "School", "Items", "Amount", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((order) => {
                    const cfg = STATUS_CONFIG[order.status]
                    const nextStatus = NEXT_STATUS[order.status]
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-blue-700">#{order.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-400">{order.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{order.school}</td>
                        <td className="px-4 py-3 text-gray-600">{order.items}</td>
                        <td className="px-4 py-3 font-medium">{formatPrice(order.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {nextStatus && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-blue-700 hover:bg-blue-800"
                                onClick={() => advanceStatus(order.id, order.status)}
                              >
                                Mark {STATUS_CONFIG[nextStatus].label}
                              </Button>
                            )}
                            {["placed", "confirmed"].includes(order.status) && (
                              <Button variant="outline" size="sm" className="h-7 text-xs text-red-500 border-red-200">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
