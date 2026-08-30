import Link from "next/link"
import {
  TrendingUp, ShoppingBag, Users, GraduationCap, Package,
  AlertTriangle, Clock, RefreshCw, ArrowRight, ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { formatPrice } from "@/lib/utils-shop"

const STATS = [
  { label: "Total Revenue", value: formatPrice(482500), icon: TrendingUp, change: "+18%", color: "text-green-600" },
  { label: "Total Orders", value: "1,284", icon: ShoppingBag, change: "+12%", color: "text-blue-600" },
  { label: "Customers", value: "896", icon: Users, change: "+9%", color: "text-indigo-600" },
  { label: "Active Schools", value: "24", icon: GraduationCap, change: "+3", color: "text-purple-600" },
  { label: "Products", value: "312", icon: Package, change: "+15", color: "text-amber-600" },
  { label: "Low Stock", value: "8", icon: AlertTriangle, change: "items", color: "text-orange-600" },
  { label: "Pending Orders", value: "43", icon: Clock, change: "today", color: "text-yellow-600" },
  { label: "Return Requests", value: "7", icon: RefreshCw, change: "open", color: "text-red-600" },
]

const RECENT_ORDERS = [
  { id: "SK20241210", customer: "Priya Sharma", school: "DPS Greater Noida", amount: 4200, status: "confirmed" },
  { id: "SK20241209", customer: "Rahul Gupta", school: "Ryan International", amount: 1499, status: "shipped" },
  { id: "SK20241209", customer: "Neha Verma", school: "Amity Gurugram", amount: 2850, status: "placed" },
  { id: "SK20241208", customer: "Amit Kumar", school: "Kendriya Vidyalaya", amount: 699, status: "delivered" },
  { id: "SK20241208", customer: "Sunita Singh", school: "Modern School", amount: 3100, status: "packed" },
]

const STATUS_COLORS: Record<string, string> = {
  placed: "bg-gray-100 text-gray-700",
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-indigo-100 text-indigo-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

const ADMIN_NAV = [
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Schools", href: "/admin/schools", icon: GraduationCap },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Inventory", href: "/admin/inventory", icon: AlertTriangle },
  { label: "Customers", href: "/admin/customers", icon: Users },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-blue-700" />
            <span className="font-bold text-gray-900">DressApp Uniforms Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <LinkButton href="/" target="_blank" variant="outline" size="sm">
              View Store ↗
            </LinkButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Admin nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ADMIN_NAV.map((item) => (
            <LinkButton key={item.href} href={item.href} variant="outline" size="sm" className="gap-1.5">
              <item.icon className="h-4 w-4" />
              {item.label}
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
                  <span className={`text-xs font-medium ${stat.color}`}>{stat.change}</span>
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
                    {["Order", "Customer", "School", "Amount", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {RECENT_ORDERS.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                      <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                      <td className="px-4 py-3 text-gray-600">{order.school}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(order.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" className="h-7 text-blue-700 text-xs">
                          View
                        </Button>
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
