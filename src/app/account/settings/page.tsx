"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({ full_name: "", phone: "" })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" })
  const [savingPass, setSavingPass] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)
  const [passSaved, setPassSaved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login?next=/account/settings"); return }
      setProfile({
        full_name: user.user_metadata?.full_name ?? "",
        phone: user.user_metadata?.phone ?? "",
      })
      setLoading(false)
    })
  }, [router])

  async function saveProfile() {
    setSavingProfile(true); setProfileError(null); setProfileSaved(false)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: profile.full_name.trim(), phone: profile.phone.trim() },
    })
    // Also update profiles table
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").update({ full_name: profile.full_name.trim(), phone: profile.phone.trim(), updated_at: new Date().toISOString() }).eq("id", user.id)
    }
    if (error) { setProfileError(error.message); setSavingProfile(false); return }
    setSavingProfile(false); setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  async function changePassword() {
    if (passwords.newPass.length < 8) { setPassError("Password must be at least 8 characters."); return }
    if (passwords.newPass !== passwords.confirm) { setPassError("Passwords do not match."); return }
    setSavingPass(true); setPassError(null); setPassSaved(false)
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass })
    if (error) { setPassError(error.message); setSavingPass(false); return }
    setSavingPass(false); setPassSaved(true)
    setPasswords({ current: "", newPass: "", confirm: "" })
    setTimeout(() => setPassSaved(false), 3000)
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="text-gray-500 hover:text-gray-700"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      </div>

      {/* Profile */}
      <Card className="mb-5">
        <CardHeader className="pb-3"><CardTitle className="text-base">Profile Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {profileError && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{profileError}</div>}
          <div><Label>Full Name</Label><Input className="mt-1" placeholder="Priya Sharma" value={profile.full_name} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))} /></div>
          <div><Label>Phone</Label><Input className="mt-1" placeholder="9876543210" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} /></div>
          <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : profileSaved ? <><Check className="h-4 w-4 mr-1" /> Saved!</> : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {passError && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{passError}</div>}
          <div><Label>New Password</Label><Input type="password" className="mt-1" placeholder="Min 8 characters" value={passwords.newPass} onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))} /></div>
          <div><Label>Confirm New Password</Label><Input type="password" className="mt-1" placeholder="Repeat password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} /></div>
          <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={changePassword} disabled={savingPass}>
            {savingPass ? <Loader2 className="h-4 w-4 animate-spin" /> : passSaved ? <><Check className="h-4 w-4 mr-1" /> Password updated!</> : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
