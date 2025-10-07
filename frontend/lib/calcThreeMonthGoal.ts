// lib/ranking/calcThreeMonthGoal.ts
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
async function countParticipantsByActivePauses(startISO: string, endISO: string): Promise<number> {
  const supabase = createClientComponentClient()

  const { count, error } = await supabase
    .from('active_pauses')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', startISO)
    .lte('created_at', endISO)

  if (error) {
    console.error('countParticipantsByActivePauses error', error)
    return 0
  }
  return count ?? 0
}

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
  { includeOneShots = true, onlyBusinessDays = true, participantsOverride }: {
    includeOneShots?: boolean
    onlyBusinessDays?: boolean
    participantsOverride?: number
  } = {}
): Promise<{ goal75: number, rawTotal: number, perUserTotal: number, usersCount: number, startISO: string, endISO: string }> {
  const supabase = createClientComponentClient()
  const { start, end } = threeMonthWindowFromDeadline(deadline)

  // ISO en UTC (Postgres TIMESTAMPTZ se apaña bien con estas)
  const startISO = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0)).toISOString().slice(0, 10)
  const endISO   = new Date(Date.UTC(end.getFullYear(),   end.getMonth(),   end.getDate(),   23, 59, 59, 999)).toISOString().slice(0, 10)

  let usersCount = participantsOverride ?? 0
  if (usersCount <= 0) {
    usersCount = await countParticipantsByActivePauses(start.toISOString(), end.toISOString())
    if (usersCount <= 0) usersCount = 1 // evita 0 por seguridad
  }

  const { data, error } = await supabase.rpc('calc_ap_totals', {
    p_start: startISO,
    p_end: endISO,
    p_users: usersCount,
    p_include_one_shots: includeOneShots,
    p_only_business_days: onlyBusinessDays,
    // puedes sobreescribir los defaults si cambian en el futuro:
    // p_daily_ap: 60, p_weekly_ap: 250, p_one_shot_ap: 1065
  })

  if (error) {
    console.error('calc_ap_totals RPC error', error)
    // fallback conservador: meta simbólica
    return { goal75: 5000, rawTotal: 5000, perUserTotal: 0, usersCount, startISO, endISO }
  }

  // La función devuelve un rowset; tomamos el primero.
  const row = Array.isArray(data) ? data[0] : data
  const goal75 = Number(row?.dept_target_75 ?? 5000)
  const rawTotal = Number(row?.dept_total_ap ?? goal75)
  const perUserTotal = Number(row?.per_user_total ?? 0)

  return { goal75, rawTotal, perUserTotal, usersCount, startISO, endISO }
}
