import Link from "next/link"
import { CheckCircle, GraduationCap, Users, Package, BarChart3, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "School Partnerships",
  description: "Partner with DressApp Uniforms to provide a seamless uniform shopping experience for your school community.",
}

const BENEFITS = [
  { icon: Package, title: "Dedicated School Store", desc: "Your school gets a branded storefront showing only your approved uniform list." },
  { icon: Users, title: "Parent-Friendly Shopping", desc: "Parents select their child's class and gender and see exactly what's required." },
  { icon: CheckCircle, title: "Inventory Management", desc: "We manage stock levels, send low-stock alerts, and handle fulfillment." },
  { icon: BarChart3, title: "Sales Analytics", desc: "Track uniform adoption rates and popular products for your school." },
]

const HOW_IT_WORKS = [
  { step: "1", title: "Sign Up", desc: "Register your school with us. Our team verifies and onboards you within 48 hours." },
  { step: "2", title: "Upload Catalogue", desc: "Share your uniform list. We photograph, list, and price all items on the platform." },
  { step: "3", title: "Go Live", desc: "Your school's uniform store is live. Share the link with parents — they're ready to order." },
  { step: "4", title: "Sit Back", desc: "We handle orders, delivery, exchanges and returns. You focus on education." },
]

export default function SchoolPartnershipsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-5">
          <GraduationCap className="h-4 w-4" /> For Schools & Institutions
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Partner with DressApp Uniforms
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Give your school community a seamless, digital-first uniform shopping experience — at no cost to the school.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <LinkButton href="/bulk-orders" size="lg" className="bg-blue-700 hover:bg-blue-800 font-bold">
            Request a Partnership <ArrowRight className="h-4 w-4 ml-2" />
          </LinkButton>
          <LinkButton href="mailto:schools@dressappuniforms.in" size="lg" variant="outline">
            Email Us Directly
          </LinkButton>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardContent className="p-6 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <div className="mb-14">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white text-xl font-extrabold flex items-center justify-center mx-auto mb-3 shadow">{step}</div>
              <p className="font-semibold text-gray-900 mb-1">{title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-10 text-white text-center">
        <h2 className="text-2xl font-extrabold mb-3">Ready to get started?</h2>
        <p className="text-blue-100 mb-6 max-w-md mx-auto">Join schools across India providing parents a simpler way to buy uniforms.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <LinkButton href="/bulk-orders" size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold">Request a Partnership</LinkButton>
        </div>
        <p className="text-blue-200 text-sm mt-6">📧 schools@dressappuniforms.in &nbsp;·&nbsp; 📞 1800-000-0000</p>
      </div>
    </div>
  )
}
