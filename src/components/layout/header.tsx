"use client"

import Link from "next/link"
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { useState } from "react"
import { useRouter } from "next/navigation"

const NAV_LINKS = [
  { label: "Shop by School", href: "/schools", highlight: true },
  { label: "Uniforms", href: "/products?category=uniform" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Bags", href: "/products?category=bags" },
  { label: "Shoes", href: "/products?category=footwear" },
  { label: "Gifts", href: "/products?category=gifts" },
  { label: "Sale", href: "/products?sale=true", sale: true },
]

export function Header() {
  const totalItems = useCartStore((s) => s.getTotalItems())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Promo bar */}
      <div className="bg-blue-700 text-white text-xs text-center py-2 font-medium tracking-wide">
        <span className="sm:hidden">🚚 Free delivery above ₹499</span>
        <span className="hidden sm:inline">🚚 Free delivery on orders above ₹499 &nbsp;·&nbsp; Easy 7-day exchanges &nbsp;·&nbsp; 100% authentic uniforms</span>
      </div>

      {/* Main row */}
      <div className="border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="lg:hidden shrink-0 inline-flex items-center justify-center rounded-lg h-9 w-9 hover:bg-gray-100 transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="p-5 border-b bg-blue-700">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-blue-700 font-black text-sm">D</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">DressApp</p>
                    <p className="text-blue-200 text-xs leading-tight">Uniforms</p>
                  </div>
                </Link>
              </div>
              <nav className="p-3 flex flex-col gap-0.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      link.highlight
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : link.sale
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="px-3 pt-2 border-t mx-3">
                <Link href="/account" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <User className="h-4 w-4" /> My Account
                </Link>
                <Link href="/orders" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <ShoppingCart className="h-4 w-4" /> My Orders
                </Link>
                <Link href="/wishlist" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <Heart className="h-4 w-4" /> Wishlist
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-base">D</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold text-gray-900 text-base leading-tight">DressApp</p>
              <p className="text-blue-700 text-xs font-semibold leading-tight -mt-0.5 tracking-wide uppercase">Uniforms</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  link.highlight
                    ? "bg-blue-700 text-white hover:bg-blue-800"
                    : link.sale
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 max-w-xs">
            <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search school, product..."
              className="pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white text-sm rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Action icons */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Heart className="h-5 w-5 text-gray-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/account">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 ml-0.5"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        {showSearch && (
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearch} className="flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                autoFocus
                placeholder="Search school, product..."
                className="pl-9 bg-gray-50 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
