import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product/product-card"
import { UniformKitBuilder } from "@/components/product/uniform-kit-builder"
import { getSchoolBySlug, getProductsForSchool, getUniformKitForSchool } from "@/lib/supabase/queries"

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const school = await getSchoolBySlug(slug)
  if (!school) return { title: "School not found" }
  return {
    title: `${school.name} Uniform`,
    description: `Shop the complete uniform kit for ${school.name}.`,
  }
}

export default async function SchoolStorePage({ params }: Props) {
  const { slug } = await params
  const school = await getSchoolBySlug(slug)
  if (!school) notFound()

  const [schoolProducts, uniformKit] = await Promise.all([
    getProductsForSchool(school.id),
    getUniformKitForSchool(school.id),
  ])

  // If no school products linked yet, fall back to all products
  const allProducts = schoolProducts.length > 0
    ? schoolProducts
    : await (async () => {
        const { createClient } = await import("@/lib/supabase/server")
        const sb = await createClient()
        const { data } = await sb
          .from("products")
          .select("*, category:categories(*), images:product_images(id,url,alt_text,sort_order), variants:product_variants(id,size,sku,price,stock)")
          .eq("is_active", true)
        return (data ?? []) as typeof schoolProducts
      })()

  const boys = allProducts.filter((p) => p.gender === "boys" || p.gender === "unisex")
  const girls = allProducts.filter((p) => p.gender === "girls" || p.gender === "unisex")
  const accessories = allProducts.filter((p) => (p.category as { slug?: string })?.slug === "accessories")
  const bags = allProducts.filter((p) => (p.category as { slug?: string })?.slug === "bags")

  const initials = school.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("")

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <Link href="/schools" className="flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-4 w-fit">
            <ArrowLeft className="h-4 w-4" /> All Schools
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">{initials}</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{school.name}</h1>
              <p className="flex items-center gap-1 text-blue-200 mt-1">
                <MapPin className="h-4 w-4" /> {school.location || `${school.city}, ${school.state}`}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">Boys & Girls</Badge>
                {school.classes_from && school.classes_to && (
                  <Badge className="bg-white/20 text-white border-white/30">Class {school.classes_from}–{school.classes_to}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Tabs defaultValue="boys">
              <div className="overflow-x-auto">
                <TabsList className="mb-6 min-w-max">
                  <TabsTrigger value="boys">Boys ({boys.length})</TabsTrigger>
                  <TabsTrigger value="girls">Girls ({girls.length})</TabsTrigger>
                  <TabsTrigger value="accessories">Accessories ({accessories.length})</TabsTrigger>
                  <TabsTrigger value="bags">Bags ({bags.length})</TabsTrigger>
                </TabsList>
              </div>

              {[
                { value: "boys", items: boys },
                { value: "girls", items: girls },
                { value: "accessories", items: accessories },
                { value: "bags", items: bags },
              ].map(({ value, items }) => (
                <TabsContent key={value} value={value}>
                  {items.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <p>No products in this category yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {items.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-20">
              {uniformKit ? (
                <UniformKitBuilder kit={uniformKit} />
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
                  <p className="font-medium">No uniform kit set up yet</p>
                  <p className="text-sm mt-1">Add a kit from the admin panel.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
