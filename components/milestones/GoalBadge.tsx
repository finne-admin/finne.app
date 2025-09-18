'use client'

type Props = {
  current: number
  goal: number
  className?: string
  label?: string
}

export default function GoalBadge({ current, goal, className, label = 'Puntos del departamento' }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((current / Math.max(goal, 1)) * 100)))

  return (
    <div
      className={['mx-auto w-full', className].filter(Boolean).join(' ')}
      style={{ maxWidth: 'var(--pig, 420px)' }}
      aria-label={label}
    >
      <div className="rounded-xl border border-emerald-200 bg-white/70 shadow-sm px-4 py-3">
        <div className="flex items-end justify-between">
          <span className="text-emerald-700 font-semibold">{label}</span>
          <span className="font-bold tabular-nums text-slate-900">{current} / {goal}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
