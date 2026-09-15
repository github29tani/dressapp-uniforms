"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Pencil, Trash2, Package, Eye, EyeOff, Loader2, Layers, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils-shop"
import type { Product, Category, ProductVariant } from "@/types"

const EMPTY_FORM = { name: "", description: "", category_id: "", gender: "unisex" as "boys" | "girls" | "unisex", price: "", discount_price: "" }
const EMPTY_VARIANT = { size: "", sku: "", price: "", stock: "0" }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [activeCat, setActiveCat] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Variant management
  const [showVariants, setShowVariants] = useState(false)
  const [variantProduct, setVariantProduct] = useState<Product | null>(null)
  const [variantForm, setVariantForm] = useState(EMPTY_VARIANT)
  const [savingVariant, setSavingVariant] = useState(false)
  const [variantError, setVariantError] = useState<string | null>(null)

  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(id,url,alt_text,sort_order), variants:product_variants(id,size,sku,price,stock)")
      .order("created_at", { ascending: false })
    setProducts((data ?? []) as Product[])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => setCategories((data ?? []) as Category[]))
  }, [load])

  const filtered = products.filter((p) => {
    const q = query.toLowerCase()
    const matchQ = !q || p.name.toLowerCase().includes(q) || (p.category as Category | undefined)?.name.toLowerCase().includes(q)
    const matchC = activeCat === "all" || (p.category as Category | undefined)?.slug === activeCat
    return matchQ && matchC
  })

  function openAdd() { setForm(EMPTY_FORM); setEditId(null); setError(null); setShowForm(true) }
  function openEdit(p: Product) {
    setForm({
      name: p.name,
      description: p.description ?? "",
      category_id: (p.category_id as string) ?? "",
      gender: p.gender,
      price: String(p.price),
      discount_price: String(p.discount_price ?? ""),
    })
    setEditId(p.id); setError(null); setShowForm(true)
  }

  async function handleSave() {
    if (!form.name || !form.price) { setError("Name and price are required."); return }
    setSaving(true); setError(null)
    const payload = {
      name: form.name,
      description: form.description || null,
      category_id: form.category_id || null,
      gender: form.gender,
      price: Math.round(Number(form.price) * 100),
      discount_price: form.discount_price ? Math.round(Number(form.discount_price) * 100) : null,
      updated_at: new Date().toISOString(),
    }
    if (editId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editId)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const { error } = await supabase.from("products").insert({ ...payload, slug })
      if (error) { setError(error.message); setSaving(false); return }
    }
    setSaving(false); setShowForm(false); load()
  }

  async function toggleActive(p: Product) {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return
    await supabase.from("products").delete().eq("id", id)
    load()
  }

  function openVariants(p: Product) {
    setVariantProduct(p)
    setVariantForm(EMPTY_VARIANT)
    setVariantError(null)
    setShowVariants(true)
  }

  async function handleAddVariant() {
    if (!variantProduct || !variantForm.size.trim()) { setVariantError("Size is required."); return }
    setSavingVariant(true); setVariantError(null)
    const { error } = await supabase.from("product_variants").insert({
      product_id: variantProduct.id,
      size: variantForm.size.trim(),
      sku: variantForm.sku.trim() || null,
      price: variantForm.price ? Math.round(Number(variantForm.price) * 100) : null,
      stock: parseInt(variantForm.stock) || 0,
    })
    if (error) { setVariantError(error.message); setSavingVariant(false); return }
    setSavingVariant(false)
    setVariantForm(EMPTY_VARIANT)
    // Refresh variant list
    const { data } = await supabase.from("product_variants").select("*").eq("product_id", variantProduct.id)
    setVariantProduct((p) => p ? { ...p, variants: (data ?? []) as ProductVariant[] } : p)
    load()
  }

  async function handleDeleteVariant(variantId: string) {
    if (!variantProduct) return
    await supabase.from("product_variants").delete().eq("id", variantId)
    const { data } = await supabase.from("product_variants").select("*").eq("product_id", variantProduct.id)
    setVariantProduct((p) => p ? { ...p, variants: (data ?? []) as ProductVariant[] } : p)
    load()
  }

  async function handleUpdateVariantStock(variantId: string, stock: number) {
    await supabase.from("product_variants").update({ stock }).eq("id", variantId)
    await supabase.from("inventory").upsert({ variant_id: variantId, stock, updated_at: new Date().toISOString() })
    if (variantProduct) {
      setVariantProduct((p) => p ? { ...p, variants: p.variants.map((v) => v.id === variantId ? { ...v, stock } : v) } : p)
    }
    load()
  }

  const totalStock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0)

  function stockBadge(stock: number) {
    if (stock === 0) return <Badge className="bg-red-100 text-red-700 text-xs">Out of Stock</Badge>
    if (stock <= 10) return <Badge className="bg-orange-100 text-orange-700 text-xs">Low: {stock}</Badge>
    return <Badge className="bg-green-100 text-green-700 text-xs">{stock} units</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><Package className="h-5 w-5 text-blue-700" /><span className="font-bold text-gray-900">Product Management</span></div>
          <Button className="bg-blue-700 hover:bg-blue-800 gap-1.5" onClick={openAdd}><Plus className="h-4 w-4" /> Add Product</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1">
            {["all", ...categories.map((c) => c.slug)].map((slug) => (
              <button key={slug} onClick={() => setActiveCat(slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCat === slug ? "bg-blue-700 text-white" : "bg-white border text-gray-600 hover:border-blue-300"}`}>
                {slug === "all" ? "All" : categories.find((c) => c.slug === slug)?.name}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-y">
                    <tr>{["Product", "Category", "Gender", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-gray-400">No products found</td></tr>
                    ) : filtered.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><p className="font-medium text-gray-900 max-w-[200px] truncate">{product.name}</p><p className="text-xs text-gray-400 mt-0.5">{product.slug}</p></td>
                        <td className="px-4 py-3 text-gray-600">{(product.category as Category | undefined)?.name ?? "—"}</td>
                        <td className="px-4 py-3 capitalize text-gray-600">{product.gender}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{formatPrice(product.discount_price ?? product.price)}</p>
                          {product.discount_price && <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>}
                        </td>
                        <td className="px-4 py-3">{stockBadge(totalStock(product))}</td>
                        <td className="px-4 py-3"><Badge className={product.is_active ? "bg-green-100 text-green-700 text-xs" : "bg-gray-100 text-gray-500 text-xs"}>{product.is_active ? "Active" : "Hidden"}</Badge></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(product)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleActive(product)}>{product.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={() => handleDelete(product.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
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

      {/* Add / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <div><Label>Product Name *</Label><Input className="mt-1" placeholder="DPS White School Shirt" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Input className="mt-1" placeholder="Short description..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm((f) => ({ ...f, category_id: v ?? "" }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v as "boys" | "girls" | "unisex" }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys</SelectItem>
                    <SelectItem value="girls">Girls</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price (₹) *</Label><Input className="mt-1" type="number" placeholder="499" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div>
              <div><Label>Sale Price (₹)</Label><Input className="mt-1" type="number" placeholder="449" value={form.discount_price} onChange={(e) => setForm((f) => ({ ...f, discount_price: e.target.value }))} /></div>
            </div>
            <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
