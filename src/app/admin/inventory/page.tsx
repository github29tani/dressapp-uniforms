"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, Search, Package, Loader2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils-shop"

interface InventoryRow {
  id: string
  variant_id: string
  stock: number
  low_stock_alert: number
  updated_at: string
  variant: {
    id: string; size: string; sku?: string
    product: { id: string; name: string; slug: string; price: number; category: { name: string } | null }
  }
}

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [editRow, setEditRow] = useState<InventoryRow | null>(null)
  const [newStock, setNewStock] = useState("")
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("inventory")
      .select("*, variant:product_variants(id, size, sku, product:products(id, name, slug, price, category:categories(name)))")
      .order("stock", { ascending: true })
    setRows((data ?? []) as InventoryRow[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = rows.filter((r) => {
    if (!query) return true
    const q = query.toLowerCase()
    return r.variant?.product?.name?.toLowerCase().includes(q) || r.variant?.sku?.toLowerCase().includes(q)
  })

  const outOfStock = filtered.filter((r) => r.stock === 0)
  const lowStock = filtered.filter((r) => r.stock > 0 && r.stock <= r.low_stock_alert)

  async function handleUpdateStock() {
    if (!editRow || newStock === "") return
    setSaving(true)
    const stock = parseInt(newStock)
    await supabase.from("inventory").update({ stock, updated_at: new Date().toISOString() }).eq("id", editRow.id)
    await supabase.from("product_variants").update({ stock }).eq("id", editRow.variant_id)
    setSaving(false); setEditRow(null); load()
  }

  function stockBadge(row: InventoryRow) {
    if (row.stock === 0) return <Badge className="bg-red-100 text-red-700 text-xs">Out of Stock</Badge>
    if (row.stock <= row.low_stock_alert) return <Badge className="bg-orange-100 text-orange-700 text-xs">Low: {row.stock}</Badge>
    return <Badge className="bg-green-100 text-green-700 text-xs">{row.stock} in stock</Badge>
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
        {(outOfStock.length > 0 || lowStock.length > 0) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {outOfStock.length > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4" /> {outOfStock.length} variants out of stock
              </div>
            )}
            {lowStock.length > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 text-sm text-orange-700">
                <AlertTriangle className="h-4 w-4" /> {lowStock.length} variants running low
              </div>
            )}
          </div>
        )}

        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search products or SKU..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-y">
                    <tr>{["Product", "Category", "Size / SKU", "Price", "Stock", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-400">{rows.length === 0 ? "No inventory data. Add products and variants first." : "No results"}</td></tr>
                    ) : filtered.map((row) => (
                      <tr key={row.id} className={`hover:bg-gray-50 ${row.stock === 0 ? "bg-red-50/30" : row.stock <= row.low_stock_alert ? "bg-orange-50/30" : ""}`}>
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{row.variant?.product?.name ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{row.variant?.product?.category?.name ?? "—"}</td>
                        <td className="px-4 py-3"><span className="font-medium">{row.variant?.size}</span>{row.variant?.sku && <span className="text-gray-400 text-xs ml-2">({row.variant.sku})</span>}</td>
                        <td className="px-4 py-3">{row.variant?.product?.price ? formatPrice(row.variant.product.price) : "—"}</td>
                        <td className="px-4 py-3">{stockBadge(row)}</td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setEditRow(row); setNewStock(String(row.stock)) }}>
                            Update Stock
                          </Button>
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

      <Dialog open={!!editRow} onOpenChange={() => setEditRow(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Stock</DialogTitle></DialogHeader>
          {editRow && (
            <div className="space-y-4 mt-2">
              <div>
                <p className="font-medium text-gray-900">{editRow.variant?.product?.name}</p>
                <p className="text-sm text-gray-500">Size: {editRow.variant?.size} {editRow.variant?.sku ? `· SKU: ${editRow.variant.sku}` : ""}</p>
              </div>
              <div>
                <Label>New Stock Quantity</Label>
                <Input className="mt-1" type="number" min="0" value={newStock} onChange={(e) => setNewStock(e.target.value)} autoFocus />
              </div>
              <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleUpdateStock} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-2" />Update Stock</>}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
