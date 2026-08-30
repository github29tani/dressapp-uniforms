import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product/product-card"
import { UniformKitBuilder } from "@/components/product/uniform-kit-builder"
import { MOCK_SCHOOLS, MOCK_PRODUCTS, MOCK_UNIFORM_KIT } from "@/lib/mock-data"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const school = MOCK_SCHOOLS.find((s) => s.slug === slug)
  if (!school) return { title: "School not found" }
  return {
    title: `${school.name} Uniform`,
    description: `Shop the complete uniform kit for ${school.name}, ${school.location}.`,
  }
}

export default async function SchoolStorePage({ params }: Props) {
  const { slug } = await params
  const school = MOCK_SCHOOLS.find((s) => s.slug === slug)
  if (!school) notFound()

  // In production, filter by school association
  const schoolProducts = MOCK_PRODUCTS

  const boys = schoolProducts.filter((p) => p.gender === "boys" || p.gender === "unisex")
  const girls = schoolProducts.filter((p) => p.gender === "girls" || p.gender === "unisex")
  const accessories = schoolProducts.filter((p) => p.category?.slug === "accessories")
  const bags = schoolProducts.filter((p) => p.category?.slug === "bags")

  return (
    <div>
      {/* School banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/schools"
            className="flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-4 w-fit"
          >
            <ArrowLeft className="h-4 w-4" /> All Schools
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {school.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{school.name}</h1>
              <p className="flex items-center gap-1 text-blue-200 mt-1">
                <MapPin className="h-4 w-4" /> {school.location}, {school.state}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">Boys & Girls</Badge>
                <Badge className="bg-white/20 text-white border-white/30">Class 1-12</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: product tabs */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Tabs defaultValue="boys">
              <div className="overflow-x-auto">
                <TabsList className="mb-6 min-w-max">
                  <TabsTrigger value="boys">Boys</TabsTrigger>
                  <TabsTrigger value="girls">Girls</TabsTrigger>
                  <TabsTrigger value="accessories">Accessories</TabsTrigger>
                  <TabsTrigger value="bags">Bags</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="boys">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {boys.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </TabsContent>

              <TabsContent value="girls">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {girls.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </TabsContent>

              <TabsContent value="accessories">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {accessories.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </TabsContent>

              <TabsContent value="bags">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {bags.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Uniform kit builder */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-20">
              <UniformKitBuilder kit={MOCK_UNIFORM_KIT} />
              <p className="text-xs text-gray-400 text-center mt-3">
                * Showing Class 6 Boys Summer Uniform as example
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
