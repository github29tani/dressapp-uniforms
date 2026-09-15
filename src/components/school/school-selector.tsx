"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SchoolCard } from "@/components/school/school-card"
import { createClient } from "@/lib/supabase/client"
import { getLocalSchools } from "@/lib/data"
import type { School } from "@/types"

export function SchoolSelector() {
  const [query, setQuery] = useState("")
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSchools() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("schools")
          .select("*")
          .eq("is_active", true)
          .order("name")
        
        if (error) throw error
        
        setSchools(
          (data ?? []).map((s: Record<string, unknown>) => ({
            ...s,
            location: [s.address, s.city, s.state].filter(Boolean).join(", ") || (s.city as string) || "",
          })) as School[]
        )
      } catch (error) {
        // Fallback to local data
        console.log("Using local schools data")
        setSchools(getLocalSchools())
      } finally {
        setLoading(false)
      }
    }
    
    fetchSchools()
  }, [])

  const filtered = schools.filter((s) =>
    !query.trim() ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    (s.city ?? "").toLowerCase().includes(query.toLowerCase()) ||
    (s.state ?? "").toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Search your school..."
          className="pl-10 h-12 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="font-medium">No schools found</p>
          <p className="text-sm mt-1">Try a different search term.</p>
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
