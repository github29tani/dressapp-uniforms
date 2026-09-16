export function formatPrice(amountInPaise: number): string {
  // Convert paise to rupees (divide by 100)
  const amountInRupees = amountInPaise / 100
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInRupees)
}

export function discountPercent(original: number, discounted?: number): number {
  if (!discounted || discounted >= original) return 0
  return Math.round(((original - discounted) / original) * 100)
}
