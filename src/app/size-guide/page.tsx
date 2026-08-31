import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find the right size for school uniforms, shoes, and bags.",
}

const SHIRT_SIZES = [
  { size: "26", chest: "26\"", age: "4–5 yrs", height: "102–110 cm" },
  { size: "28", chest: "28\"", age: "6–7 yrs", height: "111–120 cm" },
  { size: "30", chest: "30\"", age: "8–9 yrs", height: "121–130 cm" },
  { size: "32", chest: "32\"", age: "10–11 yrs", height: "131–142 cm" },
  { size: "34", chest: "34\"", age: "12–13 yrs", height: "143–152 cm" },
  { size: "36", chest: "36\"", age: "14–15 yrs", height: "153–162 cm" },
  { size: "38", chest: "38\"", age: "16+ yrs", height: "163–170 cm" },
]

const TROUSER_SIZES = [
  { size: "22", waist: "22\"", age: "4–5 yrs" },
  { size: "24", waist: "24\"", age: "6–7 yrs" },
  { size: "26", waist: "26\"", age: "8–9 yrs" },
  { size: "28", waist: "28\"", age: "10–11 yrs" },
  { size: "30", waist: "30\"", age: "12–13 yrs" },
  { size: "32", waist: "32\"", age: "14–15 yrs" },
  { size: "34", waist: "34\"", age: "16+ yrs" },
]

const SHOE_SIZES = [
  { india: "1", uk: "1", age: "4–5 yrs" },
  { india: "2", uk: "2", age: "6 yrs" },
  { india: "3", uk: "3", age: "7–8 yrs" },
  { india: "4", uk: "4", age: "9–10 yrs" },
  { india: "5", uk: "5", age: "11 yrs" },
  { india: "6", uk: "6", age: "12–13 yrs" },
  { india: "7", uk: "7", age: "14–15 yrs" },
  { india: "8", uk: "8", age: "16+ yrs" },
]

function Table({ headers, rows }: { headers: string[], rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-blue-50">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Size Guide</h1>
        <p className="text-gray-500">Measure your child and use this chart to find the right fit. When in doubt, size up.</p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-1">How to Measure</h2>
          <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
            <li><span className="font-medium">Chest:</span> Measure around the fullest part of the chest, keeping the tape horizontal.</li>
            <li><span className="font-medium">Waist:</span> Measure around the natural waistline, keeping the tape comfortably loose.</li>
            <li><span className="font-medium">Height:</span> Stand upright against a wall. Measure from top of head to floor.</li>
            <li><span className="font-medium">Shoe:</span> Measure the foot length from heel to longest toe while standing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Shirts & Blazers</h2>
          <Table
            headers={["Size", "Chest", "Approx. Age", "Height"]}
            rows={SHIRT_SIZES.map((r) => [r.size, r.chest, r.age, r.height])}
          />
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Trousers & Skirts</h2>
          <Table
            headers={["Size", "Waist", "Approx. Age"]}
            rows={TROUSER_SIZES.map((r) => [r.size, r.waist, r.age])}
          />
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">School Shoes</h2>
          <Table
            headers={["India Size", "UK Size", "Approx. Age"]}
            rows={SHOE_SIZES.map((r) => [r.india, r.uk, r.age])}
          />
        </section>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">💡 Tip</p>
          <p>If your child is between sizes, always choose the larger size — school uniforms are worn for a full academic year and children grow quickly. Some items also have adjustable waists.</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">Still not sure?</p>
          <p>We offer free size exchanges within 7 days of delivery. Just <a href="mailto:support@dressappuniforms.in" className="underline">email us</a> or call 1800-000-0000.</p>
        </div>
      </div>
    </div>
  )
}
