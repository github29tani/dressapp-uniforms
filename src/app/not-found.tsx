import { LinkButton } from "@/components/ui/link-button"
import { GraduationCap } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
        <GraduationCap className="h-10 w-10 text-blue-700" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-xl font-semibold text-gray-700 mb-2">Page not found</p>
      <p className="text-gray-500 mb-8">
        We couldn't find what you were looking for. Try browsing by school or exploring all products.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <LinkButton href="/schools" className="bg-blue-700 hover:bg-blue-800">
          Shop by School
        </LinkButton>
        <LinkButton href="/products" variant="outline">
          All Products
        </LinkButton>
      </div>
    </div>
  )
}
