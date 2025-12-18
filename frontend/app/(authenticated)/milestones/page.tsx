// app/milestones/page.tsx
import { PerfilResumen } from '@/components/milestones/ProfileSummary'
import { ActividadSemanal } from '@/components/milestones/WeeklyActivity'
import { LogrosDesbloqueados } from '@/components/milestones/UnlockedAchievements'
import { RetosSemanales } from '@/components/milestones/WeeklyChallenges'
import CountdownCircles from '@/components/milestones/WeeklyCountdownCircles'

export default function MilestonesPage() {
  return (
    <div className="w-full space-y-8 lg:space-y-10">
      {/* Bloque 1: Perfil en ancho completo (sin contenedor extra) */}
      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-600 font-semibold">Perfil</p>
        </div>
        <PerfilResumen />
      </div>

      {/* Bloque 2: Retos semanales + contador + columna derecha sin contenedores extra */}
      <section className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr] items-start">
        <div className="space-y-4 min-w-0">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.12em] text-emerald-600 font-semibold">Retos semanales</p>
            <div className="w-full max-w-xl">
              <CountdownCircles target={new Date('2025-12-21T23:59:59')} sizePx={52} />
            </div>
          </div>
          {/* Retos sin tarjeta, listados en vertical */}
          <RetosSemanales />
        </div>

        <div className="space-y-4 min-w-0">
          <ActividadSemanal />
          <LogrosDesbloqueados />
        </div>
      </section>
    </div>
  )
}
