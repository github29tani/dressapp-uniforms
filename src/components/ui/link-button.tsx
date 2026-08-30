/**
 * LinkButton — renders a Next.js Link styled as a Button.
 * Use this instead of <Button asChild> which is unsupported in the base-ui version of shadcn.
 */
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

type Variant = VariantProps<typeof buttonVariants>["variant"]
type Size = VariantProps<typeof buttonVariants>["size"]

interface LinkButtonProps {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  target?: string
  rel?: string
}

export function LinkButton({
  href,
  variant = "default",
  size = "default",
  className,
  children,
  target,
  rel,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  )
}
