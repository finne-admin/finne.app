import Image from "next/image"
import { RankingUsuarios } from "@/components/milestones/RankingUsuarios"

export default function RankingPage() {
  return (
    <div className="px-6 py-8">
      {/* 2 columnas: contenido + columna auto (ancho controlado por el aside) */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[1fr_auto] gap-10">
        {/* SECCIÓN: Ranking */}
        <section aria-labelledby="ranking-title" className="w-full max-w-3xl">
          <RankingUsuarios />
        </section>

        {/* SECCIÓN: Hucha (columna fluida) */}
        <aside className="hidden md:block w-[clamp(240px,28vw,520px)]">
          <div
            className="sticky"
            style={{
              // el tamaño "lógico" de la hucha = ancho de la columna
              ['--pig' as any]: 'clamp(240px,28vw,520px)',
              // pegada ~20px del borde inferior del viewport
              top: 'calc(100vh - var(--pig) - 20px)',
            }}
          >
            <Image
              src="/ahorro.png"
              alt="Icono ahorro"
              width={800}   // valores grandes para mantener ratio; el CSS manda
              height={800}
              className="mx-auto opacity-90 w-full h-auto"
              // para que Next sirva el tamaño óptimo
              sizes="(min-width: 768px) clamp(240px,28vw,520px), 60vw"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
