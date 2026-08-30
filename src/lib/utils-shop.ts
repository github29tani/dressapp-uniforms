export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function discountPercent(original: number, discounted?: number): number {
  if (!discounted || discounted >= original) return 0
  return Math.round(((original - discounted) / original) * 100)
}
