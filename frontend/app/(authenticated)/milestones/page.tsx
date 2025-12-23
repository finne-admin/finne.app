// app/milestones/page.tsx
import { PerfilResumen } from '@/components/milestones/ProfileSummary'
import { ActividadSemanal } from '@/components/milestones/WeeklyActivity'
import { LogrosDesbloqueados } from '@/components/milestones/UnlockedAchievements'
import { RetosSemanales } from '@/components/milestones/WeeklyChallenges'
import CountdownCircles from '@/components/milestones/WeeklyCountdownCircles'

export default function MilestonesPage() {
  return (
    <div className="w-full space-y-8 lg:space-y-10">
      {/* Bloque 1: Perfil en ancho completo (sin contenedor extra) */}
      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-600 font-semibold">Perfil</p>
        </div>
        <PerfilResumen />
      </div>

      {/* Bloque 2: Retos semanales + contador + columna derecha sin contenedores extra */}
      <section className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr] items-start">
        <div className="space-y-4 min-w-0">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.12em] text-emerald-600 font-semibold">Retos semanales</p>
            <div className="w-full max-w-xl">
              {(() => {
              // Devuelve Date con el domingo de la semana actual a las 23:59:59 en timezone Europe/Madrid
              const getMadridSundayEnd = (): Date => {
                const now = new Date();
                const partsFor = (tz: string) =>
                new Intl.DateTimeFormat('en', {
                  timeZone: tz,
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false,
                })
                  .formatToParts(now)
                  .reduce((acc: Record<string, number>, p) => {
                  if (p.type !== 'literal') acc[p.type] = Number(p.value);
                  return acc;
                  }, {});
                const utc = partsFor('UTC');
                const madrid = partsFor('Europe/Madrid');

                // offset (ms) between Madrid and UTC at "now"
                const madridAsIfUTC = Date.UTC(madrid.year, madrid.month - 1, madrid.day, madrid.hour, madrid.minute, madrid.second);
                const utcAsUTC = Date.UTC(utc.year, utc.month - 1, utc.day, utc.hour, utc.minute, utc.second);
                const offsetMs = madridAsIfUTC - utcAsUTC;

                // weekday in Madrid (0 = Sunday)
                const weekday = new Date(Date.UTC(madrid.year, madrid.month - 1, madrid.day, madrid.hour, madrid.minute, madrid.second)).getUTCDay();
                const daysToAdd = (0 - weekday + 7) % 7;

                // target as if the wall-clock date is UTC, then subtract offset to get real UTC timestamp
                const targetAsIfUTC = Date.UTC(madrid.year, madrid.month - 1, madrid.day + daysToAdd, 23, 59, 59);
                const targetTs = targetAsIfUTC - offsetMs;
                return new Date(targetTs);
              };

              return <CountdownCircles target={getMadridSundayEnd()} sizePx={52} />;
              })()}
            </div>
          </div>
          {/* Retos sin tarjeta, listados en vertical */}
          <RetosSemanales />
        </div>

        <div className="space-y-4 min-w-0">
          <ActividadSemanal />
          <LogrosDesbloqueados />
        </div>
      </section>
    </div>
  )
}
