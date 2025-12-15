'use client'

import { useEffect, useRef, useState } from "react"
import CountdownCircles from "./CountdownCircles"
import GoalBadge from "./GoalBadge"
import CerditoGlobo from "./DepartmentBalloon"
import { apiGet } from "@/lib/apiClient"

type Props = {
  goal: number
  deadline: Date | string | number
  pigHeight?: number
  className?: string
}

export default function HuchaPanel({ goal, deadline, pigHeight = 520, className }: Props) {
  const [totalExp, setTotalExp] = useState(0)

  const topBlockRef = useRef<HTMLDivElement>(null)
  const [ceilingPx, setCeilingPx] = useState(0)

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await apiGet("/api/milestones/department/progress")
        const data = await res.json()
        if (!res.ok) {
          console.error("Error al obtener progreso del departamento:", data)
          return
        }
        setTotalExp(Number(data.total ?? 0))
      } catch (error) {
        console.error("Error al cargar progreso del departamento:", error)
      }
    }

    fetchTotal()
  }, [])

  useEffect(() => {
    const el = topBlockRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      setCeilingPx(entries[0].contentRect.height + 12)
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
        current={totalExp}
        height={pigHeight}
        className="w-[var(--pig)]"
        ceilingPx={ceilingPx}
        showInlineCount={false}
      />
    </div>
  )
}
