import { PerfilResumen } from '@/components/milestones/PerfilResumen'
import { ActividadSemanal } from '@/components/milestones/ActividadSemanal'
import { LogrosDesbloqueados } from '@/components/milestones/LogrosDesbloqueados'
import { RetosSemanales } from '@/components/milestones/RetosSemanales' // 👈 nuevo

export default function MilestonesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <RetosSemanales />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <h2
          className="
            text-2xl md:text-xl font-extrabold tracking-wide mb-8 text-center
            text-gradient bg-ink-melt animate-ink-melt animate-ink-melt-fast select-none
          "
          style={{
            ['--tw-gradient-image' as any]:
              'linear-gradient(90deg, #059669, #10b981, #047857)',
          }}
        >
          Temporada Post Verano — 1 septiembre — 30 noviembre
        </h2>
        <div className="space-y-6">
          <PerfilResumen />
          <ActividadSemanal />
        </div>
        <div className="h-full self-stretch">
          <LogrosDesbloqueados />
        </div>
      </div>
    </div>
  )
}
