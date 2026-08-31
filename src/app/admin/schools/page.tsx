"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Pencil, Trash2, MapPin, GraduationCap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { School } from "@/types"

const INDIAN_STATES = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]
const EMPTY_FORM = { name: "", school_code: "", board: "", city: "", state: "", address: "", phone: "", email: "", principal_name: "" }

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from("schools").select("*").order("created_at", { ascending: false })
    setSchools((data ?? []).map((s: Record<string, unknown>) => ({ ...s, location: [s.address, s.city, s.state].filter(Boolean).join(", ") || (s.city as string) || "" })) as School[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = schools.filter((s) => !query || s.name.toLowerCase().includes(query.toLowerCase()) || (s.city ?? "").toLowerCase().includes(query.toLowerCase()))

  function openAdd() { setForm(EMPTY_FORM); setEditId(null); setError(null); setShowForm(true) }
  function openEdit(s: School) {
    setForm({ name: s.name, school_code: s.school_code ?? "", board: s.board ?? "", city: s.city ?? "", state: s.state ?? "", address: s.address ?? "", phone: s.phone ?? "", email: s.email ?? "", principal_name: s.principal_name ?? "" })
    setEditId(s.id); setError(null); setShowForm(true)
  }

  async function handleSave() {
    if (!form.name) { setError("School name is required."); return }
    setSaving(true); setError(null)
    const payload = { ...form, updated_at: new Date().toISOString() }
    if (editId) {
      const { error } = await supabase.from("schools").update(payload).eq("id", editId)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const { error } = await supabase.from("schools").insert({ ...payload, slug })
      if (error) { setError(error.message); setSaving(false); return }
    }
    setSaving(false); setShowForm(false); load()
  }

  async function toggleActive(s: School) {
    await supabase.from("schools").update({ is_active: !s.is_active }).eq("id", s.id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this school? This cannot be undone.")) return
    await supabase.from("schools").delete().eq("id", id)
    load()
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><GraduationCap className="h-5 w-5 text-blue-700" /><span className="font-bold text-gray-900">School Management</span></div>
          <Button className="bg-blue-700 hover:bg-blue-800 gap-1.5" onClick={openAdd}><Plus className="h-4 w-4" /> Add School</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search schools..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-400">No schools found</div>
            ) : filtered.map((school) => (
              <Card key={school.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
                        {school.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{school.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {school.city}{school.state ? `, ${school.state}` : ""}</p>
                        {school.board && <p className="text-xs text-blue-600 mt-0.5">{school.board}</p>}
                      </div>
                    </div>
                    <Badge className={school.is_active ? "bg-green-100 text-green-700 text-xs shrink-0" : "bg-gray-100 text-gray-500 text-xs shrink-0"}>
                      {school.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => openEdit(school)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => toggleActive(school)}>{school.is_active ? "Hide" : "Activate"}</Button>
                    <Button variant="outline" size="sm" className="text-xs text-red-400 border-red-200 hover:bg-red-50" onClick={() => handleDelete(school.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit School" : "Add School"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <div><Label>School Name *</Label><Input className="mt-1" placeholder="Delhi Public School" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>School Code</Label><Input className="mt-1" placeholder="DPS001" value={form.school_code} onChange={(e) => set("school_code", e.target.value)} /></div>
              <div><Label>Board</Label><Input className="mt-1" placeholder="CBSE" value={form.board} onChange={(e) => set("board", e.target.value)} /></div>
            </div>
            <div><Label>Address</Label><Input className="mt-1" placeholder="Sector 12, Near Metro" value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>City</Label><Input className="mt-1" placeholder="Delhi" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
              <div>
                <Label>State</Label>
                <Select value={form.state} onValueChange={(v) => set("state", v ?? "")}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input className="mt-1" placeholder="011-12345678" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div><Label>Email</Label><Input className="mt-1" placeholder="info@school.edu.in" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
            </div>
            <div><Label>Principal Name</Label><Input className="mt-1" placeholder="Dr. Sharma" value={form.principal_name} onChange={(e) => set("principal_name", e.target.value)} /></div>
            <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Save Changes" : "Add School"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
