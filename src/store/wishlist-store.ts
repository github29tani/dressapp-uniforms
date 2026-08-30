import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types"

interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  toggle: (product: Product) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.find((i) => i.id === product.id)) return state
          return { items: [...state.items, product] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }))
      },

      isWishlisted: (productId) => !!get().items.find((i) => i.id === productId),

      toggle: (product) => {
        const { isWishlisted, addItem, removeItem } = get()
        isWishlisted(product.id) ? removeItem(product.id) : addItem(product)
      },
    }),
    { name: "dressapp-wishlist" }
  )
)
