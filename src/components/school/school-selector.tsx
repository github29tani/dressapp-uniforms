"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SchoolCard } from "./school-card"
import { MOCK_SCHOOLS } from "@/lib/mock-data"

export function SchoolSelector() {
  const [query, setQuery] = useState("")

  const filtered = MOCK_SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.city.toLowerCase().includes(query.toLowerCase()) ||
      s.state.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          className="pl-10 h-12 text-base bg-white shadow-sm"
          placeholder="Search your school by name or city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search schools"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No schools found</p>
          <p className="text-sm mt-1">Try a different search term or contact us to add your school.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      )}
    </div>
  )
}
