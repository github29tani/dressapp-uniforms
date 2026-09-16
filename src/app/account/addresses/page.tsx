"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, MapPin, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { INDIAN_STATES } from "@/lib/constants"
import type { Address } from "@/types"

export const dynamic = 'force-dynamic'

const EMPTY = { label: "", full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", is_default: false }

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  const load = useCallback(async (uid: string) => {
    const { data } = await supabase.from("addresses").select("*").eq("user_id", uid).order("is_default", { ascending: false })
    setAddresses((data ?? []) as Address[])
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login?next=/account/addresses"); return }
      setUserId(user.id); load(user.id)
    })
  }, [load, router])

  function openAdd() { setForm(EMPTY); setEditId(null); setError(null); setShowForm(true) }
  function openEdit(a: Address) {
    setForm({ label: a.label ?? "", full_name: a.full_name, phone: a.phone, line1: a.line1, line2: a.line2 ?? "", city: a.city, state: a.state, pincode: a.pincode, is_default: a.is_default })
    setEditId(a.id); setError(null); setShowForm(true)
  }

  async function handleSave() {
    if (!form.full_name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) { setError("Please fill all required fields."); return }
    if (!userId) return
    setSaving(true); setError(null)
    const payload = { ...form, user_id: userId, country: "India" }
    if (editId) {
      const { error } = await supabase.from("addresses").update(payload).eq("id", editId)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from("addresses").insert(payload)
      if (error) { setError(error.message); setSaving(false); return }
    }
    setSaving(false); setShowForm(false); load(userId)
  }

  async function setDefault(id: string) {
    if (!userId) return
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId)
    await supabase.from("addresses").update({ is_default: true }).eq("id", id)
    load(userId)
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this address?")) return
    await supabase.from("addresses").delete().eq("id", id)
    if (userId) load(userId)
  }

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/account" className="text-gray-500 hover:text-gray-700"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Addresses</h1>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 gap-1.5" onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-blue-700" />
          </div>
          <p className="font-medium text-gray-900 mb-1">No addresses saved</p>
          <p className="text-sm text-gray-500 mb-6">Save your delivery address for faster checkout.</p>
          <Button className="bg-blue-700 hover:bg-blue-800" onClick={openAdd}>Add Address</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <Card key={addr.id} className={addr.is_default ? "border-blue-300 bg-blue-50/30" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-gray-900">{addr.full_name}</p>
                      {addr.label && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{addr.label}</span>}
                      {addr.is_default && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
                    </div>
                    <p className="text-sm text-gray-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} – {addr.pincode}</p>
                    <p className="text-sm text-gray-500 mt-0.5">📞 {addr.phone}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!addr.is_default && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-500" title="Set as default" onClick={() => setDefault(addr.id)}>
                        <Star className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(addr)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={() => handleDelete(addr.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit Address" : "Add Address"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <div><Label>Label (optional)</Label><Input className="mt-1" placeholder="Home / Work / School" value={form.label} onChange={(e) => set("label", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Full Name *</Label><Input className="mt-1" placeholder="Priya Sharma" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></div>
              <div><Label>Phone *</Label><Input className="mt-1" placeholder="9876543210" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            </div>
            <div><Label>Address Line 1 *</Label><Input className="mt-1" placeholder="House / Flat no., Street" value={form.line1} onChange={(e) => set("line1", e.target.value)} /></div>
            <div><Label>Address Line 2</Label><Input className="mt-1" placeholder="Area, Landmark" value={form.line2} onChange={(e) => set("line2", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>City *</Label><Input className="mt-1" placeholder="Delhi" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
              <div><Label>PIN Code *</Label><Input className="mt-1" placeholder="110001" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value)} /></div>
            </div>
            <div>
              <Label>State *</Label>
              <Select value={form.state} onValueChange={(v) => set("state", v ?? "")}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>{INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Save Changes" : "Add Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
