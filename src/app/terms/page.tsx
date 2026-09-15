import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using DressApp Uniforms.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: August 2026</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using DressApp Uniforms ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">2. Use of the Platform</h2>
          <p>You may use the Platform only for lawful purposes and in accordance with these Terms. You agree not to use the Platform in any way that violates applicable laws or regulations, or that is harmful, fraudulent, or deceptive.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">3. Account Registration</h2>
          <p>To place orders, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to notify us immediately of any unauthorized use.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">4. Orders and Payments</h2>
          <p>All orders are subject to availability and acceptance. Prices are shown in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to refuse or cancel orders at our discretion.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">5. Returns and Exchanges</h2>
          <p>Returns and exchanges are governed by our Return Policy available at <a href="/returns" className="text-blue-700 hover:underline">/returns</a>. Items must be unused, unwashed, and in original packaging to be eligible.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">6. Intellectual Property</h2>
          <p>All content on the Platform, including text, images, logos, and product descriptions, is the property of DressApp Uniforms or its licensors and is protected by applicable intellectual property laws.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">7. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, DressApp Uniforms shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or products purchased through it.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">8. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Delhi, India.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">9. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new Terms.</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">10. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:support@dressappuniforms.in" className="text-blue-700 hover:underline">support@dressappuniforms.in</a>.</p>
        </section>
      </div>
    </div>
  )
}
