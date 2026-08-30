"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Package, Heart, MapPin, RefreshCw, Users,
  ChevronRight, LogOut, Settings, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/ui/link-button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const MENU_ITEMS = [
  { icon: Package, label: "My Orders", desc: "Track and manage orders", href: "/orders" },
  { icon: Users, label: "My Children", desc: "Manage child profiles", href: "/account/children" },
  { icon: Heart, label: "Wishlist", desc: "Saved products", href: "/wishlist" },
  { icon: MapPin, label: "Addresses", desc: "Saved delivery addresses", href: "/account/addresses" },
  { icon: RefreshCw, label: "Returns & Exchanges", desc: "Manage returns", href: "/account/returns" },
  { icon: Settings, label: "Account Settings", desc: "Update profile and password", href: "/account/settings" },
]

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Derive display info from Supabase user
  const fullName =
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "My Account"
  const email = user?.email ?? ""
  const phone = user?.user_metadata?.phone ?? ""
  const initials = fullName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Profile */}
      <Card className="mb-6">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 text-lg truncate">{fullName}</h2>
            <p className="text-sm text-gray-500 truncate">{email}</p>
            {phone && <p className="text-sm text-gray-500">{phone}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">My Children</h3>
          <Link href="/account/children" className="text-sm text-blue-700 hover:underline">+ Add Child</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "Aarav", class: "Class 6", school: "Delhi Public School", gender: "Boys" },
            { name: "Ananya", class: "Class 3", school: "Delhi Public School", gender: "Girls" },
          ].map((child) => (
            <Card key={child.name} className="hover:shadow-sm transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
                  {child.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{child.name}</p>
                  <p className="text-xs text-gray-500">{child.class} · {child.gender}</p>
                  <p className="text-xs text-gray-400 truncate">{child.school}</p>
                </div>
                <LinkButton
                  href="/schools/delhi-public-school"
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 text-xs text-blue-700"
                >
                  Shop →
                </LinkButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Menu */}
      <Card>
        <CardContent className="p-0">
          {MENU_ITEMS.map((item, i) => (
            <div key={item.href}>
              <Link href={item.href}>
                <div className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </Link>
              {i < MENU_ITEMS.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sign out */}
      <Button
        variant="outline"
        className="w-full mt-4 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        onClick={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <LogOut className="h-4 w-4 mr-2" />
        )}
        Sign Out
      </Button>
    </div>
  )
}
