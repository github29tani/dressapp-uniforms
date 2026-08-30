// Simple avatar placeholder — replace with shadcn Avatar if needed
export function Avatar({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-full ${className ?? ""}`}>
      {children}
    </div>
  )
}
