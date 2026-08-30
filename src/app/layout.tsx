import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "DressApp Uniforms — School Uniforms & Essentials",
    template: "%s | DressApp Uniforms",
  },
  description:
    "Shop school uniforms, bags, shoes, and accessories for your child's school. Select your school and get the complete kit in minutes.",
  keywords: ["school uniform", "school kit", "school bag", "school shoes", "DPS uniform"],
  openGraph: {
    title: "DressApp Uniforms — School Uniforms & Essentials",
    description: "Everything your child needs for school, in one place.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
