import { RankingUsuarios } from '@/components/milestones/RankingUsuarios'

export default function RankingPage() {
  return (
    <div className="px-6 py-8">
    <h2
      className="
        text-2xl md:text-3xl font-extrabold tracking-wide mb-8 text-center
        text-gradient bg-melting-emerald-noise animate-melting melt-warp breath
        select-none cursor-default
      "
      style={{
        ['--tw-gradient-image' as any]:
          'linear-gradient(90deg, #059669, #10b981, #047857)',
      }}
    >
      Temporada Post Verano — 1 septiembre — 30 noviembre
    </h2>
      <RankingUsuarios />
    </div>
  )
}
