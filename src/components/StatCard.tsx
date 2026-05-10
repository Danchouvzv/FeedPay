import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  title: string
  value: string | number
  caption: string
  icon: LucideIcon
}

export function StatCard({ title, value, caption, icon: Icon }: StatCardProps) {
  return (
    <article className="rounded-[2rem] border-2 border-black bg-white p-5 text-black shadow-[7px_7px_0_#000] transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-black/45">{title}</p>
          <p className="mt-2 text-4xl font-black">{value}</p>
        </div>
        <span className="grid size-12 place-items-center rounded-2xl border-2 border-black bg-[#CCFF00]">
          <Icon className="size-6 text-black" />
        </span>
      </div>
      <p className="mt-4 text-sm font-bold leading-5 text-black/55">{caption}</p>
    </article>
  )
}
