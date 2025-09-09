import { RankingUsuarios } from '@/components/milestones/RankingUsuarios'

export default function RankingPage() {
  return (
    <div className="px-6 py-8">
      <h2
        className="
          text-2xl md:text-3xl font-extrabold tracking-wide mb-8 text-center
          text-gradient animate-gradient-fast motion-reduce:animate-none
          bg-texture-noise
        "
        style={{
          // Degradado temático (puedes afinar tonos)
          // Se inyecta como primera capa en --tw-gradient-image
          // para que la clase bg-texture-noise lo combine con la textura.
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
