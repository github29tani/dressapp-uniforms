"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, Package, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils-shop"

export default function AdminProductsPage() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(query.toLowerCase())
    const matchesCat = activeCategory === "all" || p.category?.slug === activeCategory
    return matchesQuery && matchesCat
  })

  const totalStock = (product: typeof MOCK_PRODUCTS[0]) =>
    product.variants.reduce((sum, v) => sum + v.stock, 0)

  function stockBadge(stock: number) {
    if (stock === 0) return <Badge className="bg-red-100 text-red-700 text-xs">Out of Stock</Badge>
    if (stock <= 10) return <Badge className="bg-orange-100 text-orange-700 text-xs">Low: {stock}</Badge>
    return <Badge className="bg-green-100 text-green-700 text-xs">{stock} units</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-700" />
            <span className="font-bold text-gray-900">Product Management</span>
          </div>
          <Button className="bg-blue-700 hover:bg-blue-800 gap-1.5">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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

        {/* Category tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="all">All ({MOCK_PRODUCTS.length})</TabsTrigger>
            {MOCK_CATEGORIES.map((cat) => {
              const count = MOCK_PRODUCTS.filter((p) => p.category?.slug === cat.slug).length
              return (
                <TabsTrigger key={cat.id} value={cat.slug}>
                  {cat.name} ({count})
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={activeCategory}>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-y">
                      <tr>
                        {["Product", "Category", "Gender", "Price", "Sizes", "Stock", "Status", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered.map((product) => {
                        const stock = totalStock(product)
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900 max-w-[200px] truncate">{product.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{product.slug}</p>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{product.category?.name}</td>
                            <td className="px-4 py-3 capitalize text-gray-600">{product.gender}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium">{formatPrice(product.discount_price ?? product.price)}</p>
                              {product.discount_price && (
                                <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-[100px]">
                                {product.variants.map((v) => (
                                  <span
                                    key={v.id}
                                    className={`text-xs border rounded px-1 py-0.5 ${
                                      v.stock > 0 ? "border-gray-300 text-gray-600" : "border-gray-200 text-gray-300"
                                    }`}
                                  >
                                    {v.size}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">{stockBadge(stock)}</td>
                            <td className="px-4 py-3">
                              <Badge className={product.is_active ? "bg-green-100 text-green-700 text-xs" : "bg-gray-100 text-gray-500 text-xs"}>
                                {product.is_active ? "Active" : "Hidden"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Edit">
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Toggle visibility">
                                  {product.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" aria-label="Delete">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
