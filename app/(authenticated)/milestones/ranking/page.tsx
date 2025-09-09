import { RankingUsuarios } from '@/components/milestones/RankingUsuarios'

export default function RankingPage() {
  return (
    <div className="px-6 py-8">
      {/* Título de temporada */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Temporada Post Verano — 1 septiembre — 30 noviembre
      </h2>

      {/* Componente Ranking */}
      <RankingUsuarios />
    </div>
  )
}