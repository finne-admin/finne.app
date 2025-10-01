'use client'

import { useEffect, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import CountdownCircles from './CountdownCircles'
import GoalBadge from './GoalBadge'
import CerditoGlobo from './CerditoGlobo'

type Props = {
  goal: number
  deadline: Date | string | number
  pigHeight?: number
  className?: string
}

export default function HuchaPanel({ goal, deadline, pigHeight = 520, className }: Props) {
  const supabase = createClientComponentClient()
  const [totalExp, setTotalExp] = useState(0)

  // medimos todo el bloque superior (contador + badge)
  const topBlockRef = useRef<HTMLDivElement>(null)
  const [ceilingPx, setCeilingPx] = useState(0)

  useEffect(() => {
    const fetchTotal = async () => {
      const { data } = await supabase.from('users').select('periodical_exp')
      if (data) {
        setTotalExp(data.reduce((acc, r: any) => acc + (r.periodical_exp ?? 0), 0))
      }
    }
    fetchTotal()
  }, [supabase])

  useEffect(() => {
    const el = topBlockRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      setCeilingPx(entries[0].contentRect.height + 12) // +16px de separación
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className={className}>
      <div ref={topBlockRef} className="space-y-3 mb-2">
        <CountdownCircles target={deadline} />
        <GoalBadge current={totalExp} goal={goal} />
      </div>

      <CerditoGlobo
        goal={goal}
        height={pigHeight}
        className="w-[var(--pig)]"
        ceilingPx={ceilingPx}
        showInlineCount={false}
      />
    </div>
  )
}
