"use client"

import { useState } from "react"
import { CheckCircle, Building2, Package, Palette, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

const FEATURES = [
  { icon: Package, title: "Bulk Uniform Orders", desc: "Order 50+ uniforms at wholesale rates with priority processing." },
  { icon: Palette, title: "Custom Embroidery & Branding", desc: "School logo, name, house colours embroidered on uniforms and bags." },
  { icon: Building2, title: "Staff & Event Uniforms", desc: "Uniforms for teachers, staff, sports events and school functions." },
  { icon: Truck, title: "Doorstep Delivery", desc: "Delivered directly to the school. Bulk packaging included." },
]

export default function BulkOrdersPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    school_name: "", contact_person: "", phone: "", email: "",
    requirements: "", estimated_quantity: "", required_date: "",
  })

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    await supabase.from("bulk_orders").insert({
      school_name:    form.school_name,
      contact_person: form.contact_person,
      phone:          form.phone,
      email:          form.email,
      requirements:   form.requirements || null,
      estimated_qty:  form.estimated_quantity ? parseInt(form.estimated_quantity) : null,
      required_date:  form.required_date || null,
      status:         "new",
    })
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Bulk Orders for Schools
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Partner with DressApp Uniforms for bulk uniform orders, custom merchandise, and branded school essentials.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardContent className="p-5 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon className="h-5 w-5 text-blue-700" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Request a Quote</h2>

              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Request Received!</h3>
                  <p className="text-gray-500 text-sm">
                    Our team will contact you within 24 hours with a detailed quote.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="school">School Name *</Label>
                      <Input id="school" placeholder="Delhi Public School" className="mt-1"
                        value={form.school_name} onChange={(e) => set("school_name", e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="contact">Contact Person *</Label>
                      <Input id="contact" placeholder="Principal / Admin" className="mt-1"
                        value={form.contact_person} onChange={(e) => set("contact_person", e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="bphone">Phone *</Label>
                      <Input id="bphone" placeholder="9876543210" className="mt-1"
                        value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="admin@school.edu.in" className="mt-1"
                        value={form.email} onChange={(e) => set("email", e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="qty">Estimated Quantity</Label>
                      <Input id="qty" type="number" placeholder="500" className="mt-1"
                        value={form.estimated_quantity} onChange={(e) => set("estimated_quantity", e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="date">Required By</Label>
                      <Input id="date" type="date" className="mt-1"
                        value={form.required_date} onChange={(e) => set("required_date", e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="req">Requirements</Label>
                      <textarea
                        id="req"
                        placeholder="Describe the uniforms, sizes, branding requirements..."
                        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-ring/50"
                        value={form.requirements}
                        onChange={(e) => set("requirements", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 h-11">
                    Submit Request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-5 space-y-3 text-sm">
              <p className="font-semibold text-blue-900">Why schools choose DressApp Uniforms?</p>
              <ul className="space-y-2 text-blue-800">
                {[
                  "Competitive wholesale pricing",
                  "School-approved uniform quality",
                  "Custom logo embroidery",
                  "Doorstep delivery to school",
                  "Dedicated account manager",
                  "Easy reorder system",
                  "Flexible payment terms for schools",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 text-sm space-y-2">
              <p className="font-semibold text-gray-900">Contact us directly</p>
              <p className="text-gray-500">For urgent inquiries or large orders, reach us at:</p>
              <p className="font-medium text-blue-700">📧 schools@dressappuniforms.in</p>
              <p className="font-medium text-blue-700">📞 1800-000-0000</p>
              <p className="text-xs text-gray-400 mt-1">Mon–Sat, 9 AM – 6 PM</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
