'use client'

import { useEffect, useMemo } from 'react'

/**
 * Sustituye estos IDs por los de tus formularios Tally:
 * - Ve a tu formulario en Tally → Share → "Open in a popup" / "Embed"
 * - El ID suele verse en la URL como: https://tally.so/r/XXXXXXXX
 */

const TALLY_FORMS = [
  { id: '3qYMX9', title: 'Cuestionario FINNE' },
  { id: '3qY7j7', title: 'Cuestionario de salud "SF12"' },
  { id: 'mV9BKy', title: 'Cuestionario "PSS" (Percieved Stress Scale)' },
  { id: 'mV9dxv', title: 'Cuestionario de uso' },
]

export default function CuestionariosPage() {
  // Carga el script oficial de Tally (solo una vez)
  useEffect(() => {
    const src = 'https://tally.so/widgets/embed.js'
    const already = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (!already) {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // URL del primer formulario para el iframe de vista rápida
  const firstFormUrl = useMemo(() => {
    const first = TALLY_FORMS[0]
    return first ? `https://tally.so/r/${first.id}?transparentBackground=1&dynamicHeight=1` : ''
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Cuestionarios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Responde a los formularios directamente desde la app. Puedes abrirlos en un popup o ver uno incrustado más abajo.
        </p>
      </header>

      {/* Botones (popup Tally) */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Abrir en popup</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TALLY_FORMS.map((form) => (
            <button
              key={form.id}
              data-tally-open={form.id}
              data-tally-width="740" // Cambia el ancho del popup aquí (valor en px)
              data-tally-emoji-text="📝"
              data-tally-emoji-animation="wave"
              className="rounded-2xl border bg-background px-4 py-3 text-left shadow-sm hover:shadow transition"
              title={`Abrir ${form.title}`}
            >
              <div className="font-medium">{form.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Pulsa para abrir el cuestionario
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Iframe incrustado */}
      {/* {firstFormUrl && (
        <section className="mt-10">
          <h2 className="text-lg font-medium mb-3">Vista incrustada</h2>
          <div className="rounded-2xl border overflow-hidden">
            <iframe
              src={firstFormUrl}
              width="100%"
              height={720}
              frameBorder={0}
              title="Cuestionario"
              // Estilos para integración limpia con Tailwind/shadcn
              className="block"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            
          </p>
        </section>
      )} */}
    </div>
  )
}

// (Opcional) Si usas metadata en layout.tsx global, no necesitas esto.
// export const metadata = { title: 'Cuestionarios' }
