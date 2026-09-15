import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DressApp Uniforms collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: August 2026</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly, including name, email address, phone number, and delivery addresses when you register or place an order. We also collect your children's school and class information to personalise your shopping experience.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1.5">
            <li>To process and fulfil your orders</li>
            <li>To send order confirmations, shipping updates, and delivery notifications</li>
            <li>To personalise product recommendations based on your child's school and class</li>
            <li>To respond to customer support requests</li>
            <li>To improve our platform and services</li>
            <li>To send promotional communications (you can opt out at any time)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">3. Information Sharing</h2>
          <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2">
            <li>Delivery partners, solely for the purpose of fulfilling your orders</li>
            <li>Payment processors (Razorpay) for secure payment handling</li>
            <li>Service providers who assist in platform operations, under strict confidentiality obligations</li>
            <li>Law enforcement when required by applicable law</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. Passwords are hashed and never stored in plain text. Payment data is handled entirely by our PCI-DSS compliant payment partner, Razorpay — we never store card details.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">5. Children's Privacy</h2>
          <p>Our platform is designed for parents and guardians to shop on behalf of school-going children. We collect minimal information about children (name, class, school, gender) solely to personalise uniform recommendations. This information is linked to the parent's account and is never shared with third parties.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">6. Cookies</h2>
          <p>We use cookies and similar technologies to maintain your session, remember your cart, and analyse platform usage. You can disable cookies in your browser settings, but this may affect platform functionality.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">7. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at <a href="mailto:support@dressappuniforms.in" className="text-blue-700 hover:underline">support@dressappuniforms.in</a>. We will respond within 30 days.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify registered users of significant changes via email.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">9. Contact Us</h2>
          <p>For privacy-related queries, contact: <a href="mailto:support@dressappuniforms.in" className="text-blue-700 hover:underline">support@dressappuniforms.in</a> · 1800-000-0000</p>
        </section>
      </div>
    </div>
  )
}
