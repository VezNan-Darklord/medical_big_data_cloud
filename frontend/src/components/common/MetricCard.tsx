type MetricCardProps = {
  label: string
  value: string
  delta: string
  tone: 'cyan' | 'red' | 'violet' | 'emerald'
}

const toneClasses: Record<MetricCardProps['tone'], string> = {
  cyan: 'from-cyan-500/25 to-sky-500/10 text-cyan-100',
  red: 'from-rose-500/25 to-orange-500/10 text-rose-100',
  violet: 'from-violet-500/25 to-fuchsia-500/10 text-violet-100',
  emerald: 'from-emerald-500/25 to-teal-500/10 text-emerald-100',
}

export function MetricCard({ label, value, delta, tone }: MetricCardProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br ${toneClasses[tone]} p-5 shadow-[0_20px_60px_rgba(15,23,42,0.28)] backdrop-blur`}>
      <div className="text-xs text-slate-300">{label}</div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">{delta}</div>
      </div>
    </div>
  )
}
