"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Users, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils-shop"

interface CustomerRow {
  id: string
  full_name: string | null
  phone: string | null
  role: string
  is_active: boolean
  created_at: string
  email: string | null
  order_count: number
  total_spent: number
  student_count: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    // Get all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, phone, role, is_active, created_at")
      .order("created_at", { ascending: false })

    if (!profiles) { setLoading(false); return }

    // For each profile, get email from auth (not possible client-side without service role)
    // and get order totals + student counts
    const enriched = await Promise.all(
      profiles.map(async (p) => {
        const [ordersRes, studentsRes] = await Promise.all([
          supabase.from("orders").select("total").eq("user_id", p.id),
          supabase.from("students").select("id", { count: "exact", head: true }).eq("user_id", p.id),
        ])
        const orders = ordersRes.data ?? []
        const total_spent = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
        return {
          ...p,
          email: null, // email lives in auth.users, not accessible client-side
          order_count: orders.length,
          total_spent,
          student_count: studentsRes.count ?? 0,
        } as CustomerRow
      })
    )
    setCustomers(enriched)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = customers.filter((c) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      (c.full_name ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q)
    )
  })

  const stats = [
    { label: "Total Customers", value: customers.length },
    { label: "Total Children", value: customers.reduce((s, c) => s + c.student_count, 0) },
    { label: "Total Orders", value: customers.reduce((s, c) => s + c.order_count, 0) },
    { label: "Total Revenue", value: formatPrice(customers.reduce((s, c) => s + c.total_spent, 0)) },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Users className="h-5 w-5 text-blue-700" />
          <span className="font-bold text-gray-900">Customer Management</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search by name or phone..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-y">
                    <tr>
                      {["Customer", "Phone", "Role", "Children", "Orders", "Total Spent", "Joined"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-gray-400">{customers.length === 0 ? "No customers yet" : "No results"}</td></tr>
                    ) : filtered.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                              {(c.full_name ?? "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <p className="font-medium text-gray-900">{c.full_name ?? "—"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{c.phone ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs capitalize">{c.role}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="secondary" className="text-xs">{c.student_count}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{c.order_count}</td>
                        <td className="px-4 py-3 font-medium">{formatPrice(c.total_spent)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
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
