"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { CLASS_LEVELS } from "@/lib/constants"
import type { Student, School } from "@/types"

const EMPTY_FORM = { name: "", school_id: "", class: "", section: "", gender: "boys" as "boys" | "girls" | "unisex" }

export default function ChildrenPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Student[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  const load = useCallback(async (uid: string) => {
    const [childRes, schoolRes] = await Promise.all([
      supabase.from("students").select("*, school:schools(id,name,slug,city)").eq("user_id", uid).order("created_at"),
      supabase.from("schools").select("id,name,slug,city,state,is_active").eq("is_active", true).order("name"),
    ])
    setChildren((childRes.data ?? []) as Student[])
    setSchools((schoolRes.data ?? []) as School[])
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login?next=/account/children"); return }
      setUserId(user.id)
      load(user.id)
    })
  }, [load, router])

  function openAdd() { setForm(EMPTY_FORM); setEditId(null); setError(null); setShowForm(true) }
  function openEdit(c: Student) {
    setForm({ name: c.name, school_id: c.school_id ?? "", class: c.class ?? "", section: c.section ?? "", gender: (c.gender as "boys" | "girls" | "unisex") ?? "boys" })
    setEditId(c.id); setError(null); setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("Child's name is required."); return }
    if (!userId) return
    setSaving(true); setError(null)
    const payload = { name: form.name.trim(), school_id: form.school_id || null, class: form.class || null, section: form.section || null, gender: form.gender, user_id: userId, updated_at: new Date().toISOString() }
    if (editId) {
      const { error } = await supabase.from("students").update(payload).eq("id", editId)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from("students").insert(payload)
      if (error) { setError(error.message); setSaving(false); return }
    }
    setSaving(false); setShowForm(false); load(userId)
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this child profile?")) return
    await supabase.from("students").delete().eq("id", id)
    if (userId) load(userId)
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/account" className="text-gray-500 hover:text-gray-700"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 gap-1.5" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Child
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
      ) : children.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-blue-700" />
          </div>
          <p className="font-medium text-gray-900 mb-1">No children added yet</p>
          <p className="text-sm text-gray-500 mb-6">Add your child's profile to quickly shop their school uniform.</p>
          <Button className="bg-blue-700 hover:bg-blue-800" onClick={openAdd}>Add First Child</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map((child) => {
            const school = child.school as { name?: string } | undefined
            return (
              <Card key={child.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                    {child.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{child.name}</p>
                    {child.class && <p className="text-sm text-gray-500">{child.class}{child.section ? ` · Section ${child.section}` : ""}</p>}
                    <p className="text-xs text-gray-400 capitalize">{child.gender}</p>
                    {school?.name && <p className="text-xs text-blue-600 mt-0.5 truncate">{school.name}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(child)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={() => handleDelete(child.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Child" : "Add Child"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <div><Label>Child's Name *</Label><Input className="mt-1" placeholder="Aarav" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div>
              <Label>School</Label>
              <Select value={form.school_id} onValueChange={(v) => set("school_id", v ?? "")}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select school" /></SelectTrigger>
                <SelectContent>{schools.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Class</Label>
                <Select value={form.class} onValueChange={(v) => set("class", v ?? "")}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>{CLASS_LEVELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Section</Label><Input className="mt-1" placeholder="A" value={form.section} onChange={(e) => set("section", e.target.value)} /></div>
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => set("gender", v ?? "boys")}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                  <SelectItem value="unisex">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Save Changes" : "Add Child"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
