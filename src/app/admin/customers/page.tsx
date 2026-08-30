"use client"

import { useState } from "react"
import { Search, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils-shop"

const DEMO_CUSTOMERS = [
  { id: "u1", name: "Priya Sharma", email: "priya@example.com", phone: "9876543210", orders: 4, total_spent: 12500, children: 2, joined: "2024-08-15" },
  { id: "u2", name: "Rahul Gupta", email: "rahul@example.com", phone: "9812345678", orders: 1, total_spent: 1499, children: 1, joined: "2024-11-20" },
  { id: "u3", name: "Neha Verma", email: "neha@example.com", phone: "9898989898", orders: 6, total_spent: 18400, children: 3, joined: "2024-06-01" },
  { id: "u4", name: "Amit Kumar", email: "amit@example.com", phone: "9011223344", orders: 2, total_spent: 3200, children: 1, joined: "2024-09-10" },
  { id: "u5", name: "Sunita Singh", email: "sunita@example.com", phone: "9922334455", orders: 3, total_spent: 7800, children: 2, joined: "2024-07-22" },
]

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("")

  const filtered = DEMO_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query)
  )

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
          {[
            { label: "Total Customers", value: DEMO_CUSTOMERS.length },
            { label: "Total Children", value: DEMO_CUSTOMERS.reduce((s, c) => s + c.children, 0) },
            { label: "Total Orders", value: DEMO_CUSTOMERS.reduce((s, c) => s + c.orders, 0) },
            { label: "Total Revenue", value: formatPrice(DEMO_CUSTOMERS.reduce((s, c) => s + c.total_spent, 0)) },
          ].map(({ label, value }) => (
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
          <Input
            className="pl-9"
            placeholder="Search by name, email, phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-y">
                  <tr>
                    {["Customer", "Contact", "Children", "Orders", "Total Spent", "Joined", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                            {customer.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-600">{customer.email}</p>
                        <p className="text-xs text-gray-400">{customer.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="secondary" className="text-xs">{customer.children}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{customer.orders}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(customer.total_spent)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(customer.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-blue-700">
                          <Eye className="h-3.5 w-3.5" /> View
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
