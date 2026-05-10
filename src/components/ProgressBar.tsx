type ProgressBarProps = {
  label: string
  value: number
  max: number
}

export function ProgressBar({ label, value, max }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm font-black uppercase">
        <span className="text-black">{label}</span>
        <span className="text-black/60">
          {value}/{max}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full bg-[#0038FF] transition-all duration-500" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
