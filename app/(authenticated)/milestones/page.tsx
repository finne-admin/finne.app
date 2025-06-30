import { PerfilResumen } from '@/components/milestones/PerfilResumen'
import { ActividadSemanal } from '@/components/milestones/ActividadSemanal'
import { LogrosDesbloqueados } from '@/components/milestones/LogrosDesbloqueados'

export default function MilestonesPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto min-h-[500px]">
      <div className="space-y-6">
        <PerfilResumen />
        <ActividadSemanal />
      </div>
      <div className="h-full self-stretch flex">
        <LogrosDesbloqueados />
      </div>
    </div>
  )
}
