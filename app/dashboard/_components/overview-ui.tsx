import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"

export function OverviewHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="mb-8">
      <p className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </header>
  )
}

export function StatCard({ label, value, icon: Icon, accent = "blue", detail }: { label: string; value: string | number; icon: LucideIcon; accent?: "blue" | "green" | "amber" | "purple"; detail?: string }) {
  const colors = { blue: "bg-blue-100 text-blue-600", green: "bg-emerald-100 text-emerald-600", amber: "bg-amber-100 text-amber-600", purple: "bg-violet-100 text-violet-600" }
  const surfaces = { blue: "from-blue-100/90 to-indigo-200/70", green: "from-cyan-100/90 to-emerald-100/80", amber: "from-sky-100/90 to-amber-100/75", purple: "from-blue-100/90 to-violet-200/75" }
  return (
    <article className={`flex min-h-44 flex-col rounded-3xl border border-blue-200/60 bg-gradient-to-br ${surfaces[accent]} p-5 shadow-lg shadow-blue-900/10 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none`}>
      <div className="flex items-center gap-3">
        <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${colors[accent]}`}><Icon aria-hidden="true" className="size-6" /></span>
        <h2 className="text-sm font-bold text-blue-950">{label}</h2>
      </div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight text-blue-950">{value}</p>
      {detail && <p className="mt-2 text-xs text-slate-500">{detail}</p>}
    </article>
  )
}

export function OverviewPanel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="dashboard-surface rounded-3xl border p-5 sm:p-6">
      <h2 className="text-xl font-bold text-blue-950">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function QuickLinks({ links }: { links: { href: string; label: string; description: string }[] }) {
  return (
    <div className="space-y-3">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="group flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600">
          <span><span className="block text-sm font-bold text-blue-950">{link.label}</span><span className="mt-1 block text-xs text-slate-500">{link.description}</span></span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
        </Link>
      ))}
    </div>
  )
}

export function StatusList({ items }: { items: { label: string; value: number }[] }) {
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-400"]
  return (
    <ul className="space-y-4">
      {items.map((item, index) => <li key={item.label} className="flex items-center gap-3 text-sm"><span className={`size-2.5 rounded-full ${colors[index % colors.length]}`} /><span className="flex-1 text-slate-600">{item.label}</span><span className="font-bold text-blue-950">{item.value}</span></li>)}
    </ul>
  )
}

export function ApplicationProgress({ accepted, pending, rejected }: { accepted: number; pending: number; rejected: number }) {
  const total = accepted + pending + rejected
  const green = total ? (accepted / total) * 100 : 0
  const orange = total ? ((accepted + pending) / total) * 100 : 0
  const background = total
    ? `conic-gradient(#10b981 0% ${green}%, #f59e0b ${green}% ${orange}%, #f87171 ${orange}% 100%)`
    : "#e2e8f0"
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div aria-hidden="true" className="flex size-32 shrink-0 items-center justify-center rounded-full" style={{ background }}>
        <div className="flex size-24 flex-col items-center justify-center rounded-full bg-[#eaf1ff]"><span className="text-2xl font-bold text-blue-950">{total}</span><span className="text-xs text-slate-500">Total</span></div>
      </div>
      <ul className="min-w-32 flex-1 space-y-4">
        {[{ label: "Accepted", value: accepted, color: "bg-emerald-500" }, { label: "Pending", value: pending, color: "bg-amber-500" }, { label: "Rejected", value: rejected, color: "bg-red-400" }].map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-sm"><span className={`size-2.5 rounded-full ${item.color}`} /><span className="flex-1 text-slate-600">{item.label}</span><span className="font-bold text-blue-950">{item.value}</span></li>
        ))}
      </ul>
    </div>
  )
}
