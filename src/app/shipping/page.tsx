import type { Metadata } from "next"
import { Truck, RefreshCw, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Delivery timelines, charges, and tracking information for DressApp Uniforms orders.",
}

const DELIVERY_OPTIONS = [
  { icon: Truck, title: "Standard Delivery", time: "5–7 business days", price: "₹49", free: "Free on orders above ₹499" },
  { icon: Clock, title: "Express Delivery", time: "2–3 business days", price: "₹99", free: "Available on all orders" },
]

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Shipping Policy</h1>
        <p className="text-gray-500">Everything you need to know about delivery, timelines and tracking.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {DELIVERY_OPTIONS.map(({ icon: Icon, title, time, price, free }) => (
          <Card key={title}>
            <CardContent className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{time}</p>
                <p className="text-sm font-medium text-blue-700 mt-0.5">{price}</p>
                <p className="text-xs text-gray-400 mt-0.5">{free}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Processing Time</h2>
          <p>Orders are processed within 24–48 hours of payment confirmation (excluding Sundays and public holidays). Once processed, you will receive an SMS and email confirmation with tracking details.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Delivery Locations</h2>
          <div className="flex gap-2 items-start">
            <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p>We currently deliver to all major cities and towns across India. Remote locations (North-East, J&K, Andaman) may take 2–3 additional days. PIN codes not serviceable by our logistics partners will be communicated before order confirmation.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Order Tracking</h2>
          <p>A tracking link is sent via SMS and email once your order is shipped. You can also track your order under <strong>My Orders</strong> in your account. Our logistics partner updates tracking every 6–12 hours.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Delivery Attempts</h2>
          <p>Our courier will make two delivery attempts. If both attempts are unsuccessful, the package is held at the nearest delivery hub for 3 days. You may contact us to reschedule. After 3 days, the package is returned and a re-shipping fee may apply.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Damaged or Missing Items</h2>
          <p>If you receive a damaged package or an item is missing, please contact us within 48 hours of delivery at <a href="mailto:support@dressappuniforms.in" className="text-blue-700 hover:underline">support@dressappuniforms.in</a> with photos. We will arrange a replacement or refund at no additional cost.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Bulk & School Orders</h2>
          <div className="flex gap-2 items-start">
            <RefreshCw className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p>Bulk orders for schools (50+ units) are processed separately with a dedicated timeline agreed upon at the time of order. Delivery is typically made directly to the school premises.</p>
          </div>
        </section>

        <div className="bg-blue-50 rounded-xl p-4 text-blue-800">
          <p className="font-semibold mb-1">Need help?</p>
          <p>Email: <a href="mailto:support@dressappuniforms.in" className="underline">support@dressappuniforms.in</a> &nbsp;·&nbsp; Call: 1800-000-0000 (Mon–Sat, 9 AM – 6 PM)</p>
        </div>
      </div>
    </div>
  )
}
