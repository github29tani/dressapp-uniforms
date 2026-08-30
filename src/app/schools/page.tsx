import { Metadata } from "next"
import { GraduationCap } from "lucide-react"
import { SchoolSelector } from "@/components/school/school-selector"

export const metadata: Metadata = {
  title: "Shop by School",
  description: "Select your child's school to browse the approved uniform catalogue.",
}

export default function SchoolsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
          <GraduationCap className="h-7 w-7 text-blue-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Shop by School</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Select your child's school to see the approved uniform list and purchase the complete kit.
        </p>
      </div>
      <SchoolSelector />
    </div>
  )
}
