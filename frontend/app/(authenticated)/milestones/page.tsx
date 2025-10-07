// app/milestones/page.tsx
import { PerfilResumen } from '@/components/milestones/ProfileSummary'
import { ActividadSemanal } from '@/components/milestones/WeeklyActivity'
import { LogrosDesbloqueados } from '@/components/milestones/UnlockedAchievements'
import { RetosSemanales } from '@/components/milestones/WeeklyChallenges'

export default function MilestonesPage() {
  return (
    <div className="w-full space-y-6">
      <RetosSemanales />

      <div className="text-center mb-8 select-none">
        <h2
          className="title-cq font-extrabold tracking-wide text-gradient bg-ink-melt animate-ink-melt animate-ink-melt-fast"
          style={{ ['--tw-gradient-image' as any]: 'linear-gradient(90deg,#059669,#10b981,#047857)' }}
        >
          Temporada de Otoño
        </h2>
        <p className="sub-cq mt-2 text-gray-600">1 de octubre — 30 de diciembre</p>
      </div>

      {/* grid a ancho completo */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <PerfilResumen />
          <ActividadSemanal />
        </div>
        <div className="col-span-12 lg:col-span-7 h-full self-stretch">
          <LogrosDesbloqueados />
        </div>
      </div>
    </div>
  )
}

