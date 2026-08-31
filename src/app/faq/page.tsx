import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about DressApp Uniforms — ordering, sizing, returns and more.",
}

const FAQS = [
  {
    category: "Ordering",
    items: [
      { q: "How do I order a uniform for my child?", a: "Select your school from the Schools page, pick your child's class and gender, choose sizes for each item, and add them to your cart. Then proceed to checkout and complete payment." },
      { q: "Can I order for multiple children at once?", a: "Yes. Add items for each child to your cart before checking out. You can save child profiles under My Account → My Children for faster future orders." },
      { q: "Do I need an account to place an order?", a: "Yes, an account is required so we can show your order history and enable easy exchanges. Signing up is free and takes under a minute." },
      { q: "Can I modify my order after placing it?", a: "Orders can be modified or cancelled within 30 minutes of placement. After that, please contact support at support@dressappuniforms.in." },
    ],
  },
  {
    category: "Sizing",
    items: [
      { q: "How do I know which size to order?", a: "Use our Size Guide page which provides size charts based on age, height, chest, and waist measurements. If you are between sizes, we recommend sizing up." },
      { q: "What if the size doesn't fit?", a: "We offer free size exchanges within 7 days of delivery. The item must be unwashed and unused. Just raise an exchange request from My Orders." },
      { q: "Are the sizes standard across all schools?", a: "Most uniform sizes follow standard Indian sizing, but some schools may have custom sizing. Check the product page for school-specific size notes." },
    ],
  },
  {
    category: "Payment",
    items: [
      { q: "What payment methods are accepted?", a: "We accept UPI, credit and debit cards, net banking, popular wallets, and cash on delivery (available in select pin codes)." },
      { q: "Is my payment information secure?", a: "Yes. All payments are processed by Razorpay, which is PCI-DSS compliant. We never store your card details." },
      { q: "Can I use a coupon code?", a: "Yes. Enter your coupon code in the cart before checkout. School-specific and seasonal coupons are issued periodically." },
    ],
  },
  {
    category: "Delivery",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 5–7 business days. Express delivery (₹99) takes 2–3 business days. Delivery timelines may vary for remote locations." },
      { q: "Is delivery free?", a: "Standard delivery is free on orders above ₹499. Below that, a ₹49 delivery charge applies." },
      { q: "How do I track my order?", a: "You will receive a tracking link via SMS and email once your order is shipped. You can also track from My Orders in your account." },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for unused, unwashed items in original packaging. Size exchange requests are prioritised." },
      { q: "How do I request a return or exchange?", a: "Go to My Orders, select the order, choose the item, and click 'Return / Exchange'. Our team will review and approve within 24–48 hours." },
      { q: "When will I receive my refund?", a: "Approved refunds are processed within 5–7 business days to your original payment method." },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500">Can't find your answer? Email us at <a href="mailto:support@dressappuniforms.in" className="text-blue-700 hover:underline">support@dressappuniforms.in</a></p>
      </div>

      <div className="space-y-10">
        {FAQS.map(({ category, items }) => (
          <section key={category}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">{category}</h2>
            <div className="space-y-5">
              {items.map(({ q, a }) => (
                <div key={q}>
                  <p className="font-semibold text-gray-900 mb-1.5">{q}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-6 text-center">
        <p className="font-semibold text-gray-900 mb-1">Still have questions?</p>
        <p className="text-sm text-gray-500 mb-4">Our support team is available Mon–Sat, 9 AM – 6 PM.</p>
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          <a href="mailto:support@dressappuniforms.in" className="text-blue-700 font-medium hover:underline">📧 support@dressappuniforms.in</a>
          <span className="text-gray-300">|</span>
          <a href="tel:+911800000000" className="text-blue-700 font-medium hover:underline">📞 1800-000-0000</a>
        </div>
      </div>
    </div>
  )
}
