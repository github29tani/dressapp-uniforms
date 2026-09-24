"use client"

import { useState, useEffect, Suspense } from "react"
import { SlidersHorizontal, X, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { ProductCard } from "@/components/product/product-card"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Product, Category } from "@/types"

type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating"

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category") ?? "all"
  const genderParam = searchParams.get("gender") ?? "all"
  const saleParam = searchParams.get("sale")
  const queryParam = searchParams.get("q") ?? ""

  const [sort, setSort] = useState<SortOption>("popular")
  const [filterCategory, setFilterCategory] = useState(categoryParam)
  const [filterGender, setFilterGender] = useState(genderParam)
  const [filterAvailability, setFilterAvailability] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => setCategories((data ?? []) as Category[]))
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchProducts()

    async function fetchProducts() {
      const supabase = createClient()

      // Resolve category id if needed
      let catId: string | null = null
      if (filterCategory !== "all") {
        const { data: cat } = await supabase
          .from("categories").select("id").eq("slug", filterCategory).single()
        catId = cat?.id ?? null
      }

      let q = supabase
        .from("products")
        .select("*, category:categories(*), images:product_images(id,url,alt_text,sort_order), variants:product_variants(id,size,sku,price,stock)")
        .eq("is_active", true)

      if (catId) q = q.eq("category_id", catId)
      if (filterGender !== "all") q = q.or(`gender.eq.${filterGender},gender.eq.unisex`)
      if (saleParam) q = q.not("discount_price", "is", null)
      if (queryParam) q = q.ilike("name", `%${queryParam}%`)

      if (sort === "price-asc") q = q.order("price", { ascending: true })
      else if (sort === "price-desc") q = q.order("price", { ascending: false })
      else if (sort === "rating") q = q.order("rating", { ascending: false })
      else if (sort === "newest") q = q.order("created_at", { ascending: false })
      else q = q.order("review_count", { ascending: false })

      const { data } = await q
      let rows = (data ?? []) as Product[]
      
      // Sort images by sort_order for each product
      rows = rows.map(product => ({
        ...product,
        images: (product.images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      }))
      
      if (filterAvailability === "in-stock") {
        rows = rows.filter((p) => p.variants.some((v) => v.stock > 0))
      }
      setProducts(rows)
      setLoading(false)
    }
  }, [filterCategory, filterGender, filterAvailability, sort, saleParam, queryParam])

  const activeFilters = [
    filterCategory !== "all" && { key: "category", label: categories.find((c) => c.slug === filterCategory)?.name ?? filterCategory },
    filterGender !== "all" && { key: "gender", label: filterGender },
    filterAvailability !== "all" && { key: "availability", label: "In Stock" },
  ].filter(Boolean) as { key: string; label: string }[]

  function clearFilter(key: string) {
    if (key === "category") setFilterCategory("all")
    if (key === "gender") setFilterGender("all")
    if (key === "availability") setFilterAvailability("all")
  }

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <Label className="font-semibold text-sm mb-2 block">Category</Label>
        <div className="flex flex-col gap-1">
          <button className={`text-left px-2 py-1.5 rounded text-sm ${filterCategory === "all" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`} onClick={() => setFilterCategory("all")}>All Categories</button>
          {categories.map((cat) => (
            <button key={cat.id} className={`text-left px-2 py-1.5 rounded text-sm ${filterCategory === cat.slug ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`} onClick={() => setFilterCategory(cat.slug)}>{cat.name}</button>
          ))}
        </div>
      </div>
      <div>
        <Label className="font-semibold text-sm mb-2 block">Gender</Label>
        <div className="flex flex-col gap-1">
          {["all", "boys", "girls", "unisex"].map((g) => (
            <button key={g} className={`text-left px-2 py-1.5 rounded text-sm capitalize ${filterGender === g ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`} onClick={() => setFilterGender(g)}>
              {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="font-semibold text-sm mb-2 block">Availability</Label>
        <div className="flex flex-col gap-1">
          {[{ value: "all", label: "All" }, { value: "in-stock", label: "In Stock" }].map(({ value, label }) => (
            <button key={value} className={`text-left px-2 py-1.5 rounded text-sm ${filterAvailability === value ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`} onClick={() => setFilterAvailability(value)}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {queryParam ? `Search: "${queryParam}"` : saleParam ? "Sale" : "All Products"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{loading ? "Loading..." : `${products.length} products found`}</p>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(({ key, label }) => (
            <Badge key={key} variant="secondary" className="gap-1 pl-2">
              {label}
              <button onClick={() => clearFilter(key)} className="ml-1 hover:text-red-500"><X className="h-3 w-3" /></button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <h2 className="font-semibold text-sm mb-4 text-gray-900">Filters</h2>
          <FilterPanel />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <Sheet>
              <SheetTrigger className="lg:hidden inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilters.length > 0 && <Badge className="ml-1 h-4 w-4 p-0 text-xs">{activeFilters.length}</Badge>}
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="mb-4"><SheetTitle>Filters</SheetTitle></SheetHeader>
                <FilterPanel />
              </SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={(v) => v && setSort(v as SortOption)}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Best Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
