"use client"

import { useState, useMemo } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { ProductCard } from "@/components/product/product-card"
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SCHOOLS } from "@/lib/mock-data"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating"

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const genderParam = searchParams.get("gender")
  const schoolParam = searchParams.get("school")
  const saleParam = searchParams.get("sale")
  const queryParam = searchParams.get("q")

  const [sort, setSort] = useState<SortOption>("popular")
  const [filterCategory, setFilterCategory] = useState(categoryParam ?? "all")
  const [filterGender, setFilterGender] = useState(genderParam ?? "all")
  const [filterAvailability, setFilterAvailability] = useState("all")

  const filtered = useMemo(() => {
    let products = [...MOCK_PRODUCTS]

    if (queryParam) {
      const q = queryParam.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    }

    if (filterCategory !== "all") {
      products = products.filter((p) => p.category?.slug === filterCategory)
    }
    if (filterGender !== "all") {
      products = products.filter((p) => p.gender === filterGender || p.gender === "unisex")
    }
    if (filterAvailability === "in-stock") {
      products = products.filter((p) => p.variants.some((v) => v.stock > 0))
    }
    if (saleParam) {
      products = products.filter((p) => p.discount_price)
    }

    switch (sort) {
      case "price-asc":
        products.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price))
        break
      case "price-desc":
        products.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price))
        break
      case "rating":
        products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case "newest":
        products.sort((a, b) => b.created_at.localeCompare(a.created_at))
        break
    }

    return products
  }, [filterCategory, filterGender, filterAvailability, sort, saleParam, queryParam])

  const activeFilters = [
    filterCategory !== "all" && { key: "category", label: MOCK_CATEGORIES.find((c) => c.slug === filterCategory)?.name },
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
          <button
            className={`text-left px-2 py-1.5 rounded text-sm ${filterCategory === "all" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
            onClick={() => setFilterCategory("all")}
          >
            All Categories
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`text-left px-2 py-1.5 rounded text-sm ${filterCategory === cat.slug ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
              onClick={() => setFilterCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="font-semibold text-sm mb-2 block">Gender</Label>
        <div className="flex flex-col gap-1">
          {["all", "boys", "girls", "unisex"].map((g) => (
            <button
              key={g}
              className={`text-left px-2 py-1.5 rounded text-sm capitalize ${filterGender === g ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
              onClick={() => setFilterGender(g)}
            >
              {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="font-semibold text-sm mb-2 block">Availability</Label>
        <div className="flex flex-col gap-1">
          {[
            { value: "all", label: "All" },
            { value: "in-stock", label: "In Stock" },
          ].map(({ value, label }) => (
            <button
              key={value}
              className={`text-left px-2 py-1.5 rounded text-sm ${filterAvailability === value ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
              onClick={() => setFilterAvailability(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {queryParam ? `Search: "${queryParam}"` : saleParam ? "Sale" : "All Products"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} products found</p>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map(({ key, label }) => (
            <Badge key={key} variant="secondary" className="gap-1 pl-2">
              {label}
              <button onClick={() => clearFilter(key)} className="ml-1 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <h2 className="font-semibold text-sm mb-4 text-gray-900">Filters</h2>
          <FilterPanel />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3">
            {/* Mobile filter */}
            <Sheet>
              <SheetTrigger className="lg:hidden inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium hover:bg-muted transition-colors">
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilters.length > 0 && (
                  <Badge className="ml-1 h-4 w-4 p-0 text-xs">{activeFilters.length}</Badge>
                )}
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterPanel />
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sort} onValueChange={(v) => v && setSort(v as SortOption)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Best Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-gray-500">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
