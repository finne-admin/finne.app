import { RankingUsuarios } from '@/components/milestones/RankingUsuarios'

export default function RankingPage() {
  return (
    <div className="px-6 py-8">
      <h2
        className="
          text-3xl md:text-4xl font-extrabold tracking-wide mb-8 text-center
          text-gradient animate-gradient motion-reduce:animate-none
          bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700
        "
      >
        Temporada Post Verano — 1 septiembre — 30 noviembre
      </h2>

      <RankingUsuarios />
    </div>
  )
}
