import { DateTime } from 'luxon'

type Pausa = { fecha: string } // YYYY-MM-DD

export function calcularRacha(pauses: Pausa[]) {
  const fechasActivas = new Set(
    pauses.map(p => DateTime.fromISO(p.fecha).toISODate())
  )

  let racha = 0
  let hoy = DateTime.now().startOf('day')

  // Desde hoy hacia atrás, solo días laborables (L-V)
  for (let i = 0; i < 30; i++) {
    if (hoy.weekday <= 5) {
      if (fechasActivas.has(hoy.toISODate())) {
        racha++
      } else {
        break
      }
    }
    hoy = hoy.minus({ days: 1 })
  }

  return racha
}
