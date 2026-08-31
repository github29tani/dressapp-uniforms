"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, RefreshCw, Package } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  requested:  { label: "Requested",  color: "bg-yellow-100 text-yellow-700" },
  approved:   { label: "Approved",   color: "bg-blue-100 text-blue-700" },
  rejected:   { label: "Rejected",   color: "bg-red-100 text-red-700" },
  completed:  { label: "Completed",  color: "bg-green-100 text-green-700" },
}

const REASON_LABELS: Record<string, string> = {
  wrong_size:      "Wrong Size",
  damaged_product: "Damaged Product",
  wrong_product:   "Wrong Product",
  quality_issue:   "Quality Issue",
  other:           "Other",
}

export default function ReturnsPage() {
  const router = useRouter()
  const [returns, setReturns] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login?next=/account/returns"); return }
      const { data } = await supabase
        .from("returns")
        .select("*, order:orders(order_number)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setReturns((data ?? []) as Record<string, unknown>[])
      setLoading(false)
    })
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="text-gray-500 hover:text-gray-700"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Returns & Exchanges</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>
      ) : returns.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-blue-700" />
          </div>
          <p className="font-medium text-gray-900 mb-1">No returns or exchanges</p>
          <p className="text-sm text-gray-500 mb-6">To request a return or exchange, go to your order and select the item.</p>
          <Link href="/orders" className="text-blue-700 font-medium hover:underline text-sm">View My Orders →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((r) => {
            const order = r.order as { order_number?: string } | undefined
            const statusCfg = STATUS_CONFIG[r.status as string] ?? STATUS_CONFIG.requested
            return (
              <Card key={r.id as string}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">{(r.type as string)} Request</p>
                      {order?.order_number && <p className="text-sm text-gray-500 mt-0.5">Order #{order.order_number}</p>}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusCfg.color}`}>{statusCfg.label}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Reason:</span> {REASON_LABELS[r.reason as string] ?? String(r.reason ?? "")}</p>
                    {!!r.exchange_size && <p><span className="font-medium">Exchange size:</span> {String(r.exchange_size)}</p>}
                    {!!r.description && <p className="text-gray-500 italic">{String(r.description)}</p>}
                    {!!r.refund_amount && <p><span className="font-medium">Refund:</span> ₹{((r.refund_amount as number) / 100).toFixed(2)}</p>}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(r.created_at as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
        <p className="font-semibold mb-1 flex items-center gap-2"><Package className="h-4 w-4" /> Return Policy</p>
        <p>Returns and exchanges are accepted within 7 days of delivery. Items must be unused and in original packaging. Size exchanges are subject to stock availability.</p>
      </div>
    </div>
  )
}
