import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product, ProductVariant, Coupon } from "@/types"

interface CartState {
  items: CartItem[]
  coupon: Coupon | null
  addItem: (product: Product, variant: ProductVariant, quantity?: number, childId?: string) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product, variant, quantity = 1, childId) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.variant.id === variant.id
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          const newItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random()}`,
            product,
            variant,
            quantity,
            child_id: childId,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== cartItemId),
        }))
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(cartItemId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === cartItemId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),

      removeCoupon: () => set({ coupon: null }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.discount_price ?? i.product.price
          return sum + price * i.quantity
        }, 0),

      getDiscount: () => {
        const { coupon, getSubtotal } = get()
        if (!coupon) return 0
        const subtotal = getSubtotal()
        if (coupon.min_order && subtotal < coupon.min_order) return 0
        let discount =
          coupon.type === "percentage"
            ? (subtotal * coupon.value) / 100
            : coupon.value
        if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount)
        return discount
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscount()
        const deliveryCharge = subtotal - discount >= 499 ? 0 : 49
        return subtotal - discount + deliveryCharge
      },
    }),
    { name: "dressapp-cart" }
  )
)
