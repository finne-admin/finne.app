// app/(ruta-que-sea)/ranking/page.tsx (o donde esté tu RankingPage)
'use client'

import { useEffect, useState } from 'react'
import { RankingUsuarios } from '@/components/milestones/RankingUsuarios'
import HuchaPanel from '@/components/milestones/HuchaPanel'
import { calcThreeMonthGoal } from '@/lib/calcThreeMonthGoal'

export default function RankingPage() {
  const [goal, setGoal] = useState<number | null>(null)

  // ⏱️ Ajusta aquí tu fecha objetivo (fin de los 3 meses).
  const deadline = new Date('2025-12-30T23:59:59')

  useEffect(() => {
    ;(async () => {
      const { goal75 } = await calcThreeMonthGoal(deadline, {
        includeOneShots: true,     // si la campaña de 3 meses cuenta los one-shot una vez
        onlyBusinessDays: true,    // 60 AP/día sólo L-V
        // participantsOverride: 20 // <- si quieres fijarlo a mano
      })
      setGoal(goal75)
    })()
  }, [deadline])

  return (
    <div className="px-6 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[1fr_auto] gap-10">
        <section aria-labelledby="ranking-title" className="w-full max-w-3xl">
          <RankingUsuarios />
        </section>

        <aside className="hidden md:block w-[clamp(240px,28vw,520px)]">
          <div
            className="sticky"
            style={{
              ['--pig' as any]: 'clamp(240px,28vw,520px)',
              top: 'calc(100vh - var(--pig) - 20px)',
            }}
          >
            <HuchaPanel
              goal={goal ?? 5000}                 // 👈 objetivo dinámico (75% del máximo teórico)
              deadline={deadline}                 // sigue usando tu deadline real
              pigHeight={520}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
