import { createClient } from "@/lib/supabase/server"
import type { School, Product, Category, UniformKit, Order, OrderStatus } from "@/types"
import * as LocalData from "@/lib/data"

// ─── SCHOOLS ────────────────────────────────────────────────

export async function getSchools(limit?: number) {
  try {
    const supabase = await createClient()
    let q = supabase
      .from("schools")
      .select("*")
      .eq("is_active", true)
      .order("name")
    if (limit) q = q.limit(limit)
    const { data, error } = await q
    if (error) throw error
    return (data ?? []).map(normalizeSchool)
  } catch (error) {
    // Fallback to local data
    console.log("Using local schools data")
    return LocalData.getLocalSchools(limit)
  }
}

export async function getSchoolBySlug(slug: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()
    if (error) throw error
    return normalizeSchool(data)
  } catch (error) {
    // Fallback to local data
    console.log("Using local school data for slug:", slug)
    return LocalData.getLocalSchoolBySlug(slug)
  }
}

export async function getAllSchoolsAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) { console.error("getAllSchoolsAdmin:", error.message); return [] }
  return (data ?? []).map(normalizeSchool)
}

export async function createSchool(values: {
  name: string; city?: string; state?: string; board?: string
  school_code?: string; principal_name?: string; phone?: string; email?: string
}) {
  const supabase = await createClient()
  const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const { data, error } = await supabase
    .from("schools")
    .insert({ ...values, slug })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return normalizeSchool(data)
}

export async function updateSchool(id: string, values: Partial<School>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("schools")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteSchool(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("schools").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

function normalizeSchool(s: Record<string, unknown>): School {
  return {
    ...(s as unknown as School),
    location: [s.address, s.city, s.state].filter(Boolean).join(", ") || (s.city as string) || "",
  }
}

// ─── CATEGORIES ─────────────────────────────────────────────

export async function getCategories() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
    if (error) throw error
    return (data ?? []) as Category[]
  } catch (error) {
    // Fallback to local data
    console.log("Using local categories data")
    return LocalData.getLocalCategories()
  }
}

// ─── PRODUCTS ───────────────────────────────────────────────

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(id, url, alt_text, sort_order),
  variants:product_variants(id, size, sku, price, stock)
`

export async function getProducts(opts?: {
  categorySlug?: string
  gender?: string
  search?: string
  sort?: string
  onSale?: boolean
  limit?: number
}) {
  try {
    const supabase = await createClient()
    let q = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)

    if (opts?.categorySlug && opts.categorySlug !== "all") {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", opts.categorySlug)
        .single()
      if (cat) q = q.eq("category_id", cat.id)
    }
    if (opts?.gender && opts.gender !== "all") {
      q = q.or(`gender.eq.${opts.gender},gender.eq.unisex`)
    }
    if (opts?.search) {
      q = q.ilike("name", `%${opts.search}%`)
    }
    if (opts?.onSale) {
      q = q.not("discount_price", "is", null)
    }
    if (opts?.sort === "price-asc") q = q.order("price", { ascending: true })
    else if (opts?.sort === "price-desc") q = q.order("price", { ascending: false })
    else if (opts?.sort === "rating") q = q.order("rating", { ascending: false })
    else if (opts?.sort === "newest") q = q.order("created_at", { ascending: false })
    else q = q.order("review_count", { ascending: false })

    if (opts?.limit) q = q.limit(opts.limit)

    const { data, error } = await q
    if (error) throw error
    return (data ?? []).map(normalizeProduct)
  } catch (error) {
    // Fallback to local data
    console.log("Using local products data")
    return LocalData.getLocalProducts(opts)
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .single()
    if (error) throw error
    return normalizeProduct(data)
  } catch (error) {
    // Fallback to local data
    console.log("Using local product data for slug:", slug)
    return LocalData.getLocalProductBySlug(slug)
  }
}

export async function getAllProductsAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false })
  if (error) { console.error("getAllProductsAdmin:", error.message); return [] }
  return (data ?? []).map(normalizeProduct)
}

export async function createProduct(values: {
  name: string; description?: string; category_id?: string
  gender: "boys" | "girls" | "unisex"; price: number; discount_price?: number
}) {
  const supabase = await createClient()
  const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const { data, error } = await supabase
    .from("products")
    .insert({ ...values, slug })
    .select(PRODUCT_SELECT)
    .single()
  if (error) throw new Error(error.message)
  return normalizeProduct(data)
}

export async function updateProduct(id: string, values: Record<string, unknown>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("products")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function upsertVariant(values: {
  id?: string; product_id: string; size: string; stock: number; sku?: string; price?: number
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("product_variants").upsert(values)
  if (error) throw new Error(error.message)
}

function normalizeProduct(p: Record<string, unknown>): Product {
  return {
    ...(p as unknown as Product),
    images: ((p.images as ProductImage[]) ?? []).sort((a, b) => a.sort_order - b.sort_order),
    variants: (p.variants as ProductVariant[]) ?? [],
  }
}

type ProductImage = { id: string; product_id: string; url: string; alt_text?: string; sort_order: number }
type ProductVariant = { id: string; product_id: string; size: string; sku?: string; price?: number; stock: number }

// ─── UNIFORM KITS ───────────────────────────────────────────

export async function getUniformKitForSchool(schoolId: string, opts?: { class?: string; gender?: string }) {
  const supabase = await createClient()
  let q = supabase
    .from("uniform_kits")
    .select(`*, items:uniform_kit_items(*, product:products(${PRODUCT_SELECT}))`)
    .eq("school_id", schoolId)
    .eq("is_active", true)
  if (opts?.class) q = q.eq("class", opts.class)
  if (opts?.gender) q = q.eq("gender", opts.gender)
  const { data, error } = await q.limit(1).single()
  if (error) return null
  return data as UniformKit
}

// ─── SCHOOL PRODUCTS ────────────────────────────────────────

export async function getProductsForSchool(schoolId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("school_products")
      .select(`product:products(${PRODUCT_SELECT})`)
      .eq("school_id", schoolId)
    if (error) throw error
    
    // If Supabase returns empty array, use local data instead
    if (!data || data.length === 0) {
      console.log("No products in Supabase school_products, using local data for school:", schoolId)
      return LocalData.getLocalProductsForSchool(schoolId)
    }
    
    return ((data ?? []).map((r: Record<string, unknown>) => {
      const p = r.product as Record<string, unknown>
      return normalizeProduct(p)
    }))
  } catch (error) {
    // Fallback to local data on error
    console.log("Error fetching from Supabase, using local products for school:", schoolId)
    return LocalData.getLocalProductsForSchool(schoolId)
  }
}

// ─── ORDERS ─────────────────────────────────────────────────

export async function getOrders(opts?: { status?: string; search?: string; limit?: number }) {
  const supabase = await createClient()
  let q = supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(name, slug), variant:product_variants(size))")
    .order("created_at", { ascending: false })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.search) q = q.ilike("order_number", `%${opts.search}%`)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("getOrders:", error.message); return [] }
  return (data ?? []) as Order[]
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
}

// ─── INVENTORY ──────────────────────────────────────────────

export async function getInventory(search?: string) {
  const supabase = await createClient()
  let q = supabase
    .from("inventory")
    .select("*, variant:product_variants(id, size, sku, product:products(id, name, slug, price, category:categories(name)))")
    .order("stock", { ascending: true })
  const { data, error } = await q
  if (error) { console.error("getInventory:", error.message); return [] }
  let rows = data ?? []
  if (search) {
    const s = search.toLowerCase()
    rows = rows.filter((r: Record<string, unknown>) => {
      const v = r.variant as Record<string, unknown>
      const p = v?.product as Record<string, unknown>
      return (p?.name as string)?.toLowerCase().includes(s)
    })
  }
  return rows
}

export async function updateInventoryStock(variantId: string, stock: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("inventory")
    .upsert({ variant_id: variantId, stock, updated_at: new Date().toISOString() })
  if (error) throw new Error(error.message)
  // also keep product_variants in sync
  await supabase.from("product_variants").update({ stock }).eq("id", variantId)
}
