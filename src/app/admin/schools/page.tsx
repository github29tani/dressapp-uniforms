"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, MapPin, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MOCK_SCHOOLS } from "@/lib/mock-data"
import type { School } from "@/types"

export default function AdminSchoolsPage() {
  const [query, setQuery] = useState("")
  const [schools, setSchools] = useState<School[]>(MOCK_SCHOOLS)
  const [showAdd, setShowAdd] = useState(false)
  const [newSchool, setNewSchool] = useState({ name: "", location: "", city: "", state: "" })

  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.city.toLowerCase().includes(query.toLowerCase())
  )

  function handleAdd() {
    if (!newSchool.name) return
    const school: School = {
      id: `s${Date.now()}`,
      name: newSchool.name,
      slug: newSchool.name.toLowerCase().replace(/\s+/g, "-"),
      location: newSchool.location,
      city: newSchool.city,
      state: newSchool.state,
      is_active: true,
      created_at: new Date().toISOString(),
    }
    setSchools((prev) => [school, ...prev])
    setNewSchool({ name: "", location: "", city: "", state: "" })
    setShowAdd(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-blue-700" />
          <span className="font-bold text-gray-900">School Management</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search schools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors">
              <Plus className="h-4 w-4" /> Add School
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New School</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                {[
                  { field: "name", label: "School Name", placeholder: "Delhi Public School" },
                  { field: "location", label: "Location / Area", placeholder: "Sector 12" },
                  { field: "city", label: "City", placeholder: "Delhi" },
                  { field: "state", label: "State", placeholder: "Delhi" },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <Label className="text-sm font-medium">{label}</Label>
                    <Input
                      className="mt-1"
                      placeholder={placeholder}
                      value={(newSchool as Record<string, string>)[field]}
                      onChange={(e) => setNewSchool((prev) => ({ ...prev, [field]: e.target.value }))}
                    />
                  </div>
                ))}
                <Button className="w-full bg-blue-700 hover:bg-blue-800 mt-2" onClick={handleAdd}>
                  Add School
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Schools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((school) => (
            <Card key={school.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                      {school.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{school.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {school.location}
                      </p>
                    </div>
                  </div>
                  <Badge className={school.is_active ? "bg-green-100 text-green-700 text-xs" : "bg-gray-100 text-gray-500 text-xs"}>
                    {school.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    Manage Uniform
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
