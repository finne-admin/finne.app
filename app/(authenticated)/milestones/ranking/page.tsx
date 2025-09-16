import { RankingUsuarios } from "@/components/milestones/RankingUsuarios"
import CerditoGlobo from "@/components/milestones/CerditoGlobo"

export default function RankingPage() {
  return (
    <div className="px-6 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[1fr_auto] gap-10">
        <section aria-labelledby="ranking-title" className="w-full max-w-3xl">
          <RankingUsuarios />
        </section>

        <aside className="hidden md:block w-[clamp(240px,28vw,520px)]">
          <div
            className="sticky"
            style={{
              ['--pig' as any]: 'clamp(240px,28vw,520px)',
              top: 'calc(100vh - var(--pig) - 20px)',
            }}
          >
            <CerditoGlobo goal={2400} className="w-[var(--pig)]" height={520} />
          </div>
        </aside>
      </div>
    </div>
  )
}
