const axes = [
  {
    label: 'Constancia',
    score: 84,
    badgeTop: '14%',
    badgeLeft: '50%',
    transform: 'translate(-50%, calc(-100% - 10px))',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.18)',
  },
  {
    label: 'Movilidad',
    score: 76,
    badgeTop: '38%',
    badgeLeft: '83%',
    transform: 'translate(12px, -50%)',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.18)',
  },
  {
    label: 'Respiración',
    score: 58,
    badgeTop: '79%',
    badgeLeft: '70%',
    transform: 'translate(10px, 10px)',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.18)',
  },
  {
    label: 'Recuperación',
    score: 64,
    badgeTop: '79%',
    badgeLeft: '30%',
    transform: 'translate(calc(-100% - 10px), 10px)',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
  },
  {
    label: 'Activación',
    score: 71,
    badgeTop: '38%',
    badgeLeft: '17%',
    transform: 'translate(calc(-100% - 12px), -50%)',
    color: '#f87171',
    glow: 'rgba(248,113,113,0.18)',
  },
]

const totalWellbeing = 78
const boostThreshold = 75
const boostMultiplier = 1.05
const boostActive = totalWellbeing >= boostThreshold

export default function BienestarPage() {
  return (
    <section className="py-0 xl:flex xl:h-[calc(100dvh-210px)] xl:items-center xl:overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1060px] gap-6 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-center">
        <aside className="flex flex-col justify-center gap-3 xl:pr-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Bienestar total</p>
            <div className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 xl:text-5xl">{totalWellbeing}</div>
          </div>

          <div className="space-y-2 text-sm leading-7 text-slate-600">
            <p>
              Tu equilibrio actual activa un boost de{' '}
              <span className="font-semibold text-emerald-700">x{boostMultiplier}</span> EXP a partir de{' '}
              <span className="font-semibold text-slate-900">{boostThreshold}</span> puntos.
            </p>
            <p className={boostActive ? 'text-emerald-700' : 'text-slate-500'}>
              {boostActive ? 'Boost activo ahora mismo' : 'Aun no has activado el boost'}
            </p>
          </div>

          <div className="pt-2">
            <div className="h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-[linear-gradient(90deg,#9fdbc2_0%,#67b48a_100%)]"
                style={{ width: `${Math.min((totalWellbeing / boostThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        </aside>

        <div className="relative mx-auto aspect-square w-full max-w-[470px] overflow-visible xl:max-w-[510px]">
          {axes.map((axis) => (
            <div
              key={axis.label}
              className="absolute text-center"
              style={{ top: axis.badgeTop, left: axis.badgeLeft, transform: axis.transform }}
            >
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-slate-900 shadow-[0_14px_30px_-24px_rgba(16,24,40,0.18)] sm:px-3"
                style={{
                  boxShadow: `0 14px 30px -24px rgba(16,24,40,0.18), 0 0 0 1px ${axis.color}33`,
                  background: `radial-gradient(circle at center, ${axis.glow} 0%, rgba(255,255,255,0.98) 72%)`,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: axis.color, boxShadow: `0 0 0 4px ${axis.glow}` }}
                />
                <span className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[0.58rem]">
                  {axis.label}
                </span>
                <span className="text-sm font-semibold text-slate-900 sm:text-[1rem]">{axis.score}</span>
              </div>
            </div>
          ))}

          <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_center,_rgba(167,243,208,0.24),_rgba(255,255,255,0)_64%)]" />

          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <polygon
              points="50,14 83,38 70,79 30,79 17,38"
              fill="rgba(236,253,245,0.94)"
              stroke="rgba(167,243,208,0.92)"
              strokeWidth="0.9"
            />
            <polygon
              points="50,23 71,38 63,63 37,63 29,38"
              fill="rgba(209,250,229,0.72)"
              stroke="rgba(110,231,183,0.82)"
              strokeWidth="0.8"
              strokeDasharray="1.4 1.8"
            />

            <line x1="50" y1="14" x2="50" y2="79" stroke="rgba(148,163,184,0.28)" strokeWidth="0.45" />
            <line x1="17" y1="38" x2="83" y2="38" stroke="rgba(148,163,184,0.22)" strokeWidth="0.45" />
            <line x1="17" y1="38" x2="70" y2="79" stroke="rgba(148,163,184,0.2)" strokeWidth="0.45" />
            <line x1="83" y1="38" x2="30" y2="79" stroke="rgba(148,163,184,0.2)" strokeWidth="0.45" />
            <line x1="30" y1="79" x2="70" y2="79" stroke="rgba(148,163,184,0.2)" strokeWidth="0.45" />

            <polygon
              points="50,22 71,43 63,64 38,71 24,48"
              fill="rgba(52,211,153,0.18)"
              stroke="rgba(52,211,153,0.92)"
              strokeWidth="0.95"
            />

            {[
              { x1: '50', y1: '14', x2: '50', y2: '22', color: axes[0].color },
              { x1: '83', y1: '38', x2: '71', y2: '43', color: axes[1].color },
              { x1: '70', y1: '79', x2: '63', y2: '64', color: axes[2].color },
              { x1: '30', y1: '79', x2: '38', y2: '71', color: axes[3].color },
              { x1: '17', y1: '38', x2: '24', y2: '48', color: axes[4].color },
            ].map((segment, index) => (
              <line
                key={index}
                x1={segment.x1}
                y1={segment.y1}
                x2={segment.x2}
                y2={segment.y2}
                stroke={segment.color}
                strokeWidth="1.15"
                strokeLinecap="round"
              />
            ))}

            {[
              { x: '50', y: '22', color: axes[0].color },
              { x: '71', y: '43', color: axes[1].color },
              { x: '63', y: '64', color: axes[2].color },
              { x: '38', y: '71', color: axes[3].color },
              { x: '24', y: '48', color: axes[4].color },
            ].map((point, index) => (
              <>
                <circle
                  key={`glow-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="2.8"
                  fill={point.color}
                  opacity="0.18"
                />
                <circle
                  key={`point-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="1.8"
                  fill={point.color}
                  stroke="white"
                  strokeWidth="0.8"
                />
              </>
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/96 shadow-[0_22px_44px_-30px_rgba(16,24,40,0.24)] ring-1 ring-emerald-100 sm:h-28 sm:w-28">
            <div className="text-center">
              <div className="text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-emerald-600 sm:text-[0.62rem]">
                Bienestar
              </div>
              <div className="mt-1.5 text-3xl font-semibold text-slate-900 sm:text-[2.2rem]">{totalWellbeing}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
