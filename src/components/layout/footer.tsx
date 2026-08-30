import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const SHOP_LINKS = [
  { label: "Shop by School", href: "/schools" },
  { label: "Uniforms", href: "/products?category=uniform" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Bags", href: "/products?category=bags" },
  { label: "Footwear", href: "/products?category=footwear" },
  { label: "Winter Wear", href: "/products?category=winter-wear" },
  { label: "Gifts & Merchandise", href: "/products?category=gifts" },
  { label: "Sale", href: "/products?sale=true" },
]

const ACCOUNT_LINKS = [
  { label: "My Account", href: "/account" },
  { label: "My Orders", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "My Children", href: "/account/children" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Returns & Exchanges", href: "/account/returns" },
]

const HELP_LINKS = [
  { label: "Size Guide", href: "/size-guide" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Return Policy", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Bulk Orders", href: "/bulk-orders" },
  { label: "School Partnerships", href: "/school-partnerships" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">
      {/* Main footer grid */}
      <div className="container mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow">
                <span className="text-white font-black text-lg">D</span>
              </div>
              <div>
                <p className="font-extrabold text-white text-base leading-tight">DressApp</p>
                <p className="text-blue-400 text-xs font-semibold leading-tight tracking-widest uppercase">Uniforms</p>
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Everything your child needs for school — uniforms, bags, shoes, and accessories. All in one place.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="mailto:support@dressappuniforms.in" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                support@dressappuniforms.in
              </a>
              <a href="tel:+911800000000" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                1800-000-0000
              </a>
              <span className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                Delhi, India
              </span>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.247 2.242 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.31 3.608-.975.975-2.242 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.31-.975-.975-1.247-2.242-1.31-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.31-3.608.975-.975 2.242-1.247 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="#" aria-label="Twitter / X" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-5">Shop</h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-5">Account</h3>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-5">Help</h3>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} DressApp Uniforms. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Secure payments via</span>
            <span className="font-bold text-gray-400 tracking-wide">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
