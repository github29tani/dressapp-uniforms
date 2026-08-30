"use client"

import { useState } from "react"
import { AlertTriangle, Search, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils-shop"

export default function AdminInventoryPage() {
  const [query, setQuery] = useState("")

  const allVariants = MOCK_PRODUCTS.flatMap((product) =>
    product.variants.map((v) => ({ product, variant: v }))
  )

  const filtered = allVariants.filter(
    ({ product }) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(query.toLowerCase())
  )

  const lowStock = filtered.filter(({ variant }) => variant.stock > 0 && variant.stock <= 5)
  const outOfStock = filtered.filter(({ variant }) => variant.stock === 0)

  function stockBadge(stock: number) {
    if (stock === 0) return <Badge className="bg-red-100 text-red-700 text-xs">Out of Stock</Badge>
    if (stock <= 5) return <Badge className="bg-orange-100 text-orange-700 text-xs">Low: {stock}</Badge>
    return <Badge className="bg-green-100 text-green-700 text-xs">{stock} in stock</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Package className="h-5 w-5 text-blue-700" />
          <span className="font-bold text-gray-900">Inventory Management</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {(lowStock.length > 0 || outOfStock.length > 0) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {outOfStock.length > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4" />
                {outOfStock.length} variants out of stock
              </div>
            )}
            {lowStock.length > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 text-sm text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                {lowStock.length} variants running low
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search products..."
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
                    {["Product", "Category", "Size / SKU", "Price", "Stock", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(({ product, variant }, i) => (
                    <tr key={`${product.id}-${variant.id}`} className={`hover:bg-gray-50 ${variant.stock === 0 ? "bg-red-50/30" : variant.stock <= 5 ? "bg-orange-50/30" : ""}`}>
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{product.name}</td>
                      <td className="px-4 py-3 text-gray-500">{product.category?.name}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{variant.size}</span>
                        <span className="text-gray-400 text-xs ml-2">({variant.sku})</span>
                      </td>
                      <td className="px-4 py-3">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3">{stockBadge(variant.stock)}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          Update Stock
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
