// ─── Core Entities ────────────────────────────────────────────────────────────

export interface School {
  id: string
  name: string
  slug: string
  school_code?: string
  board?: string
  logo_url?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  principal_name?: string
  classes_from?: number
  classes_to?: number
  description?: string
  is_active: boolean
  created_at: string
  updated_at?: string
  // virtual / joined
  location?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  sort_order: number
  is_active?: boolean
  created_at?: string
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string
  sku?: string
  price?: number
  stock: number
  created_at?: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text?: string
  sort_order: number
  object_fit?: "cover" | "contain"  // How image should fit in frame
  created_at?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  category_id?: string
  category?: Category
  gender: "boys" | "girls" | "unisex"
  price: number               // paise
  discount_price?: number     // paise
  rating?: number
  review_count?: number
  is_active: boolean
  created_at: string
  updated_at?: string
  // joined
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface UniformKit {
  id: string
  school_id: string
  name: string
  class?: string
  gender?: "boys" | "girls" | "unisex"
  season?: "summer" | "winter" | "sports" | "all"
  is_active: boolean
  created_at?: string
  items: UniformKitItem[]
}

export interface UniformKitItem {
  id: string
  kit_id: string
  product_id: string
  product: Product
  is_required: boolean
  sort_order: number
}

// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name?: string
  phone?: string
  role: "customer" | "school_admin" | "admin" | "superadmin"
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface Student {
  id: string
  user_id: string
  school_id?: string
  school?: School
  name: string
  class?: string
  section?: string
  gender?: "boys" | "girls" | "unisex"
  created_at: string
  updated_at?: string
}

export interface Address {
  id: string
  user_id: string
  label?: string
  full_name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
  created_at?: string
}

// ─── Cart (local Zustand) ─────────────────────────────────────────────────────

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "placed" | "confirmed" | "packed" | "shipped"
  | "out_for_delivery" | "delivered" | "cancelled"
  | "return_requested" | "returned"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded"

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  quantity: number
  unit_price: number
  total_price: number
  product?: Product
  variant?: ProductVariant
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  address_id?: string
  status: OrderStatus
  subtotal: number
  discount: number
  delivery_fee: number
  total: number
  coupon_id?: string
  notes?: string
  estimated_delivery?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  // joined
  items?: OrderItem[]
  address?: Address
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  product_id: string
  user_id: string
  order_id?: string
  rating: number
  title?: string
  body?: string
  size_fit?: "too_small" | "true_to_size" | "too_large"
  image_urls?: string[]
  is_approved: boolean
  created_at: string
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  description?: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_order_amount?: number
  max_discount?: number
  school_id?: string
  category_id?: string
  usage_limit?: number
  usage_count: number
  valid_from?: string
  valid_until?: string
  is_active: boolean
  created_at: string
}

// ─── Returns ─────────────────────────────────────────────────────────────────

export type ReturnReason = "wrong_size" | "damaged_product" | "wrong_product" | "quality_issue" | "other"

export interface Return {
  id: string
  order_id: string
  order_item_id: string
  user_id: string
  type: "return" | "exchange"
  reason: ReturnReason
  description?: string
  exchange_size?: string
  status: "requested" | "approved" | "rejected" | "completed"
  refund_amount?: number
  created_at: string
  updated_at: string
}

// ─── Bulk Orders ─────────────────────────────────────────────────────────────

export interface BulkOrder {
  id: string
  school_name: string
  contact_person: string
  phone: string
  email: string
  requirements?: string
  estimated_qty?: number
  required_date?: string
  status: "new" | "contacted" | "quoted" | "confirmed" | "completed" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
}

// ─── Inventory ───────────────────────────────────────────────────────────────

export interface InventoryRow {
  id: string
  variant_id: string
  stock: number
  low_stock_alert: number
  updated_at: string
  variant?: ProductVariant & { product?: Product }
}
