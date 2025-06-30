import { PerfilResumen } from '@/components/milestones/PerfilResumen'
import { ActividadSemanal } from '@/components/milestones/ActividadSemanal'
import { LogrosDesbloqueados } from '@/components/milestones/LogrosDesbloqueados'

export default function MilestonesPage() {
  return (
    <div className="space-y-6">
      <PerfilResumen />
      <ActividadSemanal />
      <LogrosDesbloqueados />
    </div>
  )
}
