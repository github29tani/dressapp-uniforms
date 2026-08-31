import Link from "next/link"
import {
  TrendingUp, ShoppingBag, Users, GraduationCap, Package,
  AlertTriangle, Clock, RefreshCw, ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils-shop"
import type { OrderStatus } from "@/types"

const STATUS_COLORS: Record<string, string> = {
  placed:           "bg-gray-100 text-gray-700",
  confirmed:        "bg-blue-100 text-blue-700",
  packed:           "bg-indigo-100 text-indigo-700",
  shipped:          "bg-amber-100 text-amber-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered:        "bg-green-100 text-green-700",
  cancelled:        "bg-red-100 text-red-700",
  return_requested: "bg-yellow-100 text-yellow-700",
  returned:         "bg-gray-100 text-gray-500",
}

const ADMIN_NAV = [
  { label: "Products",  href: "/admin/products",  icon: Package },
  { label: "Schools",   href: "/admin/schools",   icon: GraduationCap },
  { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag },
  { label: "Inventory", href: "/admin/inventory", icon: AlertTriangle },
  { label: "Customers", href: "/admin/customers", icon: Users },
]

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch all stats in parallel
  const [
    { count: totalOrders },
    { count: totalCustomers },
    { count: totalSchools },
    { count: totalProducts },
    { data: revenueData },
    { data: pendingOrders },
    { data: lowStockData },
    { data: returnRequests },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("schools").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("orders").select("total").in("status", ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"]),
    supabase.from("orders").select("id", { count: "exact", head: false }).in("status", ["placed", "confirmed"]),
    supabase.from("inventory").select("id", { count: "exact", head: false }).lte("stock", 5).gt("stock", 0),
    supabase.from("returns").select("id", { count: "exact", head: false }).eq("status", "requested"),
    supabase.from("orders")
      .select("id, order_number, total, status, created_at, user:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const totalRevenue = (revenueData ?? []).reduce((sum: number, o: { total: number }) => sum + (o.total ?? 0), 0)

  const STATS = [
    { label: "Total Revenue",   value: formatPrice(totalRevenue),      icon: TrendingUp,  color: "text-green-600" },
    { label: "Total Orders",    value: String(totalOrders ?? 0),       icon: ShoppingBag, color: "text-blue-600" },
    { label: "Customers",       value: String(totalCustomers ?? 0),    icon: Users,       color: "text-indigo-600" },
    { label: "Active Schools",  value: String(totalSchools ?? 0),      icon: GraduationCap, color: "text-purple-600" },
    { label: "Products",        value: String(totalProducts ?? 0),     icon: Package,     color: "text-amber-600" },
    { label: "Low Stock",       value: String(lowStockData?.length ?? 0), icon: AlertTriangle, color: "text-orange-600" },
    { label: "Pending Orders",  value: String(pendingOrders?.length ?? 0), icon: Clock,    color: "text-yellow-600" },
    { label: "Return Requests", value: String(returnRequests?.length ?? 0), icon: RefreshCw, color: "text-red-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-blue-700" />
            <span className="font-bold text-gray-900">DressApp Uniforms Admin</span>
          </div>
          <LinkButton href="/" variant="outline" size="sm">View Store ↗</LinkButton>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Admin nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ADMIN_NAV.map((item) => (
            <LinkButton key={item.href} href={item.href} variant="outline" size="sm" className="gap-1.5">
              <item.icon className="h-4 w-4" /> {item.label}
            </LinkButton>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <LinkButton href="/admin/orders" variant="outline" size="sm" className="flex items-center">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </LinkButton>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-y">
                  <tr>
                    {["Order", "Customer", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(recentOrders ?? []).length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">No orders yet</td></tr>
                  ) : (recentOrders ?? []).map((order: Record<string, unknown>) => (
                    <tr key={order.id as string} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">#{order.order_number as string}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {(order.user as { full_name?: string })?.full_name ?? "Customer"}
                      </td>
                      <td className="px-4 py-3 font-medium">{formatPrice(order.total as number)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status as string] ?? ""}`}>
                          {(order.status as string).replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(order.created_at as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
