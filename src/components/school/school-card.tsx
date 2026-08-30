import Link from "next/link"
import { MapPin, ArrowRight, BookOpen } from "lucide-react"
import type { School } from "@/types"

interface SchoolCardProps {
  school: School
}

function SchoolAvatar({ name }: { name: string }) {
  const words = name.split(" ").filter(Boolean)
  const initials =
    words.length >= 2
      ? words[0][0] + words[1][0]
      : words[0]?.slice(0, 2) ?? "DA"

  // pick a color based on the first letter
  const colors = [
    "from-blue-500 to-blue-700",
    "from-indigo-500 to-indigo-700",
    "from-violet-500 to-violet-700",
    "from-sky-500 to-sky-700",
    "from-teal-500 to-teal-700",
    "from-emerald-500 to-emerald-700",
  ]
  const idx = (initials.charCodeAt(0) ?? 0) % colors.length

  return (
    <div
      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-sm`}
    >
      {initials.toUpperCase()}
    </div>
  )
}

export function SchoolCard({ school }: SchoolCardProps) {
  return (
    <Link href={`/schools/${school.slug}`} className="group block h-full">
      <div className="h-full bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:border-blue-200 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start gap-3.5">
          <SchoolAvatar name={school.name} />
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug text-sm">
              {school.name}
            </h3>
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {school.location}
            </p>
            <span className="inline-block mt-2 text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              {school.city}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <BookOpen className="h-3.5 w-3.5" />
            <span>View uniform kit</span>
          </div>
          <div className="w-7 h-7 rounded-xl bg-blue-50 group-hover:bg-blue-700 flex items-center justify-center transition-colors">
            <ArrowRight className="h-3.5 w-3.5 text-blue-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  )
}
