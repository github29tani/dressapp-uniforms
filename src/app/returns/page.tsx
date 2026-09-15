import type { Metadata } from "next"
import { RefreshCw, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"

export const metadata: Metadata = {
  title: "Return Policy",
  description: "DressApp Uniforms return, exchange, and refund policy.",
}

const STEPS = [
  { icon: RefreshCw, title: "Raise a Request", desc: "Go to My Orders, select the item, and click Return / Exchange within 7 days of delivery." },
  { icon: CheckCircle, title: "We Review", desc: "Our team reviews your request within 24–48 hours and approves or contacts you for more info." },
  { icon: Clock, title: "Ship it Back", desc: "Pack the item in its original packaging. Our courier will pick it up or you'll get a drop-off label." },
  { icon: CheckCircle, title: "Refund / Exchange", desc: "Once we receive the item, refunds are processed within 5–7 business days. Exchanges ship immediately." },
]

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Return & Exchange Policy</h1>
        <p className="text-gray-500">We want every purchase to fit perfectly. Here's how returns and exchanges work.</p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { value: "7 Days", label: "Return Window" },
          { value: "Free", label: "Size Exchanges" },
          { value: "5–7 Days", label: "Refund Timeline" },
        ].map(({ value, label }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-blue-700">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Process */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-bold text-sm">{i + 1}</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Eligibility */}
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed mb-10">
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Eligible Items</h2>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Items must be returned within 7 days of delivery</li>
            <li>Items must be unused, unwashed, and in original packaging with tags attached</li>
            <li>Items purchased during clearance or marked "Final Sale" are not eligible</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Size Exchanges</h2>
          <p>Size exchanges are free and processed with priority. If the requested size is in stock, we dispatch it the same day your return is received. If out of stock, you'll receive a full refund.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Damaged or Wrong Items</h2>
          <div className="flex gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
            <p>If you receive a damaged or incorrect item, contact us within 48 hours at <a href="mailto:support@dressappuniforms.in" className="text-blue-700 hover:underline">support@dressappuniforms.in</a> with photos. We will arrange a replacement or full refund at no cost to you.</p>
          </div>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Refunds</h2>
          <p>Approved refunds are credited to your original payment method within 5–7 business days. UPI and wallet refunds are typically faster (1–3 days).</p>
        </section>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <p className="font-semibold text-gray-900 mb-1">Ready to return something?</p>
        <p className="text-sm text-gray-500 mb-4">Go to your orders and raise a request in seconds.</p>
        <LinkButton href="/orders" className="bg-blue-700 hover:bg-blue-800">Go to My Orders</LinkButton>
      </div>
    </div>
  )
}
