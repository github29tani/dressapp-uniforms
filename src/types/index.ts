// ─── Core Entities ────────────────────────────────────────────────────────────

export interface School {
  id: string
  name: string
  slug: string
  logo_url?: string
  location: string
  city: string
  state: string
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parent_id?: string
  icon?: string
  sort_order: number
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string
  stock: number
  sku: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt?: string
  sort_order: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  category_id: string
  category?: Category
  price: number
  discount_price?: number
  gender: "boys" | "girls" | "unisex"
  rating?: number
  review_count?: number
  is_active: boolean
  images: ProductImage[]
  variants: ProductVariant[]
  schools?: School[]
  created_at: string
}

export interface SchoolProduct {
  school_id: string
  product_id: string
  product: Product
  school_price?: number
  is_required: boolean
  class_level?: string
  uniform_type?: "summer" | "winter" | "sports" | "house"
}

export interface UniformKit {
  id: string
  school_id: string
  name: string
  class_level: string
  gender: "boys" | "girls" | "unisex"
  uniform_type: "summer" | "winter" | "sports"
  items: UniformKitItem[]
}

export interface UniformKitItem {
  id: string
  kit_id: string
  product: Product
  is_required: boolean
  sort_order: number
}

// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  avatar_url?: string
  created_at: string
}

export interface Child {
  id: string
  user_id: string
  name: string
  school_id: string
  school?: School
  class_level: string
  gender: "boys" | "girls"
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pin_code: string
  is_default: boolean
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
  child_id?: string
}

export interface Cart {
  items: CartItem[]
  coupon?: Coupon
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"

export interface OrderItem {
  id: string
  order_id: string
  product: Product
  variant: ProductVariant
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  items: OrderItem[]
  address: Address
  subtotal: number
  discount: number
  delivery_charge: number
  total: number
  payment_method: string
  payment_status: "pending" | "paid" | "failed" | "refunded"
  coupon_code?: string
  created_at: string
  updated_at: string
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  product_id: string
  user_id: string
  user?: User
  rating: number
  title?: string
  body: string
  size_feedback?: "runs_small" | "true_to_size" | "runs_large"
  images?: string[]
  created_at: string
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  min_order?: number
  max_discount?: number
  school_id?: string
  category_id?: string
  is_active: boolean
  expires_at?: string
}

// ─── Returns ─────────────────────────────────────────────────────────────────

export type ReturnReason =
  | "wrong_size"
  | "damaged"
  | "wrong_product"
  | "quality_issue"
  | "other"

export type ReturnType = "return" | "exchange"

export interface ReturnRequest {
  id: string
  order_id: string
  order_item_id: string
  type: ReturnType
  reason: ReturnReason
  description?: string
  exchange_size?: string
  status: "pending" | "approved" | "rejected" | "completed"
  created_at: string
}

// ─── Bulk Orders ─────────────────────────────────────────────────────────────

export interface BulkOrderRequest {
  id: string
  school_name: string
  contact_person: string
  phone: string
  email: string
  requirements: string
  estimated_quantity: number
  required_date: string
  status: "pending" | "quoted" | "confirmed" | "completed"
  created_at: string
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  user_id: string
  product: Product
  created_at: string
}
