import Link from "next/link"
import { ArrowRight, RefreshCw, Shield, Truck, Package, Star, ChevronRight } from "lucide-react"
import { LinkButton } from "@/components/ui/link-button"
import { Card, CardContent } from "@/components/ui/card"
import { SchoolCard } from "@/components/school/school-card"
import { ProductCard } from "@/components/product/product-card"
import { getSchools, getProducts, getCategories } from "@/lib/supabase/queries"
import { formatPrice } from "@/lib/utils-shop"

const CATEGORY_ICONS: Record<string, string> = {
  uniform: "👕",
  accessories: "🧢",
  footwear: "👟",
  bags: "🎒",
  "winter-wear": "🧥",
  gifts: "🎁",
}

const TRUST_ITEMS = [
  { icon: Truck, label: "Free delivery", sub: "On orders above ₹499" },
  { icon: RefreshCw, label: "Easy exchanges", sub: "7-day hassle-free" },
  { icon: Shield, label: "100% authentic", sub: "Verified products only" },
  { icon: Package, label: "Complete kit", sub: "Everything in one order" },
]

export default async function HomePage() {
  const [schools, products, categories] = await Promise.all([
    getSchools(6),
    getProducts({ limit: 4, sort: "popular" }),
    getCategories(),
  ])

  return (
    <div className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-blue-700">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative container mx-auto px-4 py-16 md:py-28">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
              {schools.length}+ Schools &nbsp;·&nbsp; {products.length > 0 ? "Real products" : "500+ Products"} &nbsp;·&nbsp; Trusted by parents
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5 text-balance">
              Everything Your Child Needs for School
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-md">
              Select your school, pick your class, and get the complete uniform kit — delivered to your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/schools" size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg shadow-blue-900/20">
                Shop by School <ArrowRight className="h-4 w-4 ml-2" />
              </LinkButton>
              <LinkButton href="/products" size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                Browse All Products
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust strip ──────────────────────────────────────────────── */}
      <section className="border-b bg-gray-50">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-2 md:py-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ─────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">Simple process</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Done in 3 easy steps</h2>
          <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">No more searching multiple shops. Get everything your child needs in one order.</p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-green-200 z-0" />
          {[
            { step: "1", title: "Select Your School", desc: "Search from our growing list and pick yours.", color: "bg-blue-700", ring: "ring-blue-100" },
            { step: "2", title: "Choose Class & Gender", desc: "We show the exact uniform checklist for your child.", color: "bg-indigo-600", ring: "ring-indigo-100" },
            { step: "3", title: "Pick Sizes & Order", desc: "Add the complete kit and checkout in minutes.", color: "bg-emerald-600", ring: "ring-emerald-100" },
          ].map(({ step, title, desc, color, ring }) => (
            <div key={step} className="relative z-10 flex flex-col items-center text-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${color} ring-4 ${ring} text-white text-2xl font-extrabold flex items-center justify-center shadow-lg`}>{step}</div>
              <div><h3 className="font-bold text-gray-900 mb-1">{title}</h3><p className="text-sm text-gray-500 leading-relaxed">{desc}</p></div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <LinkButton href="/schools" size="lg" className="bg-blue-700 hover:bg-blue-800 font-semibold shadow-md shadow-blue-200">
            Get Started — Select Your School <ArrowRight className="h-4 w-4 ml-2" />
          </LinkButton>
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-blue-700 text-xs font-semibold uppercase tracking-widest mb-1">Browse</p>
                <h2 className="text-2xl font-extrabold text-gray-900">Shop by Category</h2>
              </div>
              <Link href="/products" className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                  <div className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer text-center">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{CATEGORY_ICONS[cat.slug] ?? "🏫"}</span>
                    <p className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 transition-colors leading-tight">{cat.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Schools ─────────────────────────────────────────── */}
      {schools.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-700 text-xs font-semibold uppercase tracking-widest mb-1">By school</p>
              <h2 className="text-2xl font-extrabold text-gray-900">Popular Schools</h2>
              <p className="text-sm text-gray-500 mt-1">Complete uniform kits available</p>
            </div>
            <Link href="/schools" className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1">
              All schools <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => <SchoolCard key={school.id} school={school} />)}
          </div>
        </section>
      )}

      {/* ─── Featured Products ────────────────────────────────────────── */}
      {products.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-blue-700 text-xs font-semibold uppercase tracking-widest mb-1">Top picks</p>
                <h2 className="text-2xl font-extrabold text-gray-900">Popular Products</h2>
                <p className="text-sm text-gray-500 mt-1">Best sellers across all schools</p>
              </div>
              <Link href="/products" className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── Bulk Orders CTA ──────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 p-10 md:p-14 text-white text-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-5">🏫 For Schools & Institutions</div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Are You a School?</h2>
            <p className="text-blue-100 mb-8 max-w-md mx-auto text-sm leading-relaxed">Partner with us for bulk uniform orders, custom branding, embroidery, and school merchandise.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <LinkButton href="/bulk-orders" size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg">Request a Quote</LinkButton>
              <LinkButton href="/school-partnerships" size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">School Partnerships</LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
