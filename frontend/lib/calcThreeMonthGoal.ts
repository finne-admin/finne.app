// lib/ranking/calcThreeMonthGoal.ts
'use client'

import { apiPost } from "@/lib/apiClient"

/** Devuelve el primer día (00:00) del mes de una fecha en zona local */
function firstDayOfMonthLocal(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}

/** Devuelve el último día (23:59:59.999) del mes de una fecha en zona local */
function lastDayOfMonthLocal(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

/** Suma meses a una fecha (manteniendo día si es posible) */
function addMonths(d: Date, m: number) {
  return new Date(d.getFullYear(), d.getMonth() + m, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())
}

/**
 * A partir de un deadline, calcula una ventana de **3 meses naturales completos** que terminen en el mes del deadline.
 * Ej.: deadline 2025-11-30 → ventana = 2025-09-01 .. 2025-11-30
 */
export function threeMonthWindowFromDeadline(deadline: Date) {
  const end = lastDayOfMonthLocal(deadline)
  const startMonthRef = addMonths(firstDayOfMonthLocal(deadline), -2) // mes del deadline - 2
  const start = firstDayOfMonthLocal(startMonthRef)
  return { start, end }
}

/**
 * Cuenta participantes reales del ranking en el período: usuarios con al menos **una pausa activa** en la ventana.
 * Si prefieres otro criterio, cambia la consulta aquí.
 */
/**
 * Llama al RPC calc_ap_totals para obtener:
 *  - dept_total_ap: tope total teórico
 *  - dept_target_75: tope con rebaja del 25% (lo que usarás como "meta" de la hucha)
 *
 * Parámetros:
 *  - deadline: fin del tramo (se usarán 3 meses naturales hasta ese mes)
 *  - includeOneShots: si el reto de 3 meses permite sumar los one-shot (1065 AP por usuario) una sola vez
 *  - onlyBusinessDays: cuenta sólo L-V para los 60 AP diarios
 *  - participantsOverride: si quieres marcar manualmente cuántas personas participan (si no, se infiere por pausas)
 */
export async function calcThreeMonthGoal(
  deadline: Date,
  {
    includeOneShots = true,
    onlyBusinessDays = true,
    participantsOverride,
  }: {
    includeOneShots?: boolean
    onlyBusinessDays?: boolean
    participantsOverride?: number
  } = {}
): Promise<{ goal75: number; rawTotal: number; perUserTotal: number; usersCount: number; startISO: string; endISO: string }> {
  const { start, end } = threeMonthWindowFromDeadline(deadline)

  const payload = {
    deadline: deadline.toISOString(),
    includeOneShots,
    onlyBusinessDays,
    participantsOverride,
  }

  const res = await apiPost("/api/milestones/goals/calc", payload)
  const data = await res.json()
  if (!res.ok) {
    console.error("calcThreeMonthGoal error", data)
    const { start: startFallback, end: endFallback } = threeMonthWindowFromDeadline(deadline)
    return {
      goal75: 5000,
      rawTotal: 5000,
      perUserTotal: 0,
      usersCount: Math.max(1, participantsOverride ?? 1),
      startISO: startFallback.toISOString().slice(0, 10),
      endISO: endFallback.toISOString().slice(0, 10),
    }
  }

  return data
}
