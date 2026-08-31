"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils-shop"
import type { Order, OrderStatus } from "@/types"

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  placed:            { label: "Placed",            color: "bg-gray-100 text-gray-700" },
  confirmed:         { label: "Confirmed",          color: "bg-blue-100 text-blue-700" },
  packed:            { label: "Packed",             color: "bg-indigo-100 text-indigo-700" },
  shipped:           { label: "Shipped",            color: "bg-amber-100 text-amber-700" },
  out_for_delivery:  { label: "Out for Delivery",   color: "bg-orange-100 text-orange-700" },
  delivered:         { label: "Delivered",          color: "bg-green-100 text-green-700" },
  cancelled:         { label: "Cancelled",          color: "bg-red-100 text-red-700" },
  return_requested:  { label: "Return Requested",   color: "bg-yellow-100 text-yellow-700" },
  returned:          { label: "Returned",           color: "bg-gray-100 text-gray-500" },
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "confirmed", confirmed: "packed", packed: "shipped",
  shipped: "out_for_delivery", out_for_delivery: "delivered",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("orders")
      .select("*, items:order_items(id, quantity, unit_price, total_price, product:products(name), variant:product_variants(size))")
      .order("created_at", { ascending: false })
      .limit(100)
    setOrders((data ?? []) as Order[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = orders.filter((o) => {
    const matchQ = !query || o.order_number.toLowerCase().includes(query.toLowerCase())
    const matchS = statusFilter === "all" || o.status === statusFilter
    return matchQ && matchS
  })

  async function advanceStatus(id: string, current: OrderStatus) {
    const next = NEXT_STATUS[current]
    if (!next) return
    await supabase.from("orders").update({ status: next, updated_at: new Date().toISOString() }).eq("id", id)
    load()
  }

  async function cancelOrder(id: string) {
    if (!confirm("Cancel this order?")) return
    await supabase.from("orders").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", id)
    load()
  }

  const stats = [
    { label: "Total", value: orders.length },
    { label: "Pending", value: orders.filter((o) => ["placed", "confirmed"].includes(o.status)).length },
    { label: "In Transit", value: orders.filter((o) => ["packed", "shipped", "out_for_delivery"].includes(o.status)).length },
    { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-blue-700" />
          <span className="font-bold text-gray-900">Order Management</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map(({ label, value }) => (
            <Card key={label}><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></CardContent></Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search by order number..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-y">
                    <tr>{["Order", "Items", "Amount", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-400">{orders.length === 0 ? "No orders yet" : "No orders match filters"}</td></tr>
                    ) : filtered.map((order) => {
                      const cfg = STATUS_CONFIG[order.status]
                      const next = NEXT_STATUS[order.status]
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-blue-700">#{order.order_number}</td>
                          <td className="px-4 py-3 text-gray-600">{order.items?.length ?? 0} item(s)</td>
                          <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                          <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${cfg.color}`}>{cfg.label}</span></td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {next && <Button size="sm" className="h-7 text-xs bg-blue-700 hover:bg-blue-800" onClick={() => advanceStatus(order.id, order.status)}>→ {STATUS_CONFIG[next].label}</Button>}
                              {["placed", "confirmed"].includes(order.status) && <Button variant="outline" size="sm" className="h-7 text-xs text-red-500 border-red-200" onClick={() => cancelOrder(order.id)}>Cancel</Button>}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
