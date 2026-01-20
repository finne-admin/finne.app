'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type SvelteCounterElement = HTMLElement & {
  name?: string
  count?: number
}

type SvelteOrbitCardElement = HTMLElement & {
  title?: string
  subtitle?: string
  intensity?: number
  flow?: number
}

type SveltePulseBadgeElement = HTMLElement & {
  label?: string
  tone?: string
  active?: boolean
}

type SvelteRippleButtonElement = HTMLElement & {
  label?: string
  tone?: string
}

type SvelteStaggerListElement = HTMLElement & {
  label?: string
  count?: number
  cadence?: number
}

type SvelteThermometerElement = HTMLElement & {
  label?: string
  value?: number
  min?: number
  max?: number
}

type SveltePodiumElement = HTMLElement & {
  first?: number
  second?: number
  third?: number
  baseDuration?: number
  delayStep?: number
}

type SvelteBalloonGiftElement = HTMLElement & {
  lift?: number
  sway?: number
  speed?: number
  color?: string
  rope?: string
}

type SvelteAchievementCardElement = HTMLElement & {
  title?: string
  subtitle?: string
  description?: string
  progress?: number
  total?: number
  xp?: number
  status?: string
  levelIndex?: number
  levelTotal?: number
}

type SvelteParallaxCardElement = HTMLElement & {
  title?: string
  value?: string
  hint?: string
  intensity?: number
}

type SvelteFlipCounterElement = HTMLElement & {
  label?: string
  value?: number
  tone?: string
}

type SvelteParallaxStackElement = HTMLElement & {
  title?: string
  intensity?: number
  blur?: number
}

export default function SvelteLabPage() {
  const [scriptReady, setScriptReady] = useState(false)
  const [name, setName] = useState('Ada')
  const [count, setCount] = useState(2)
  const [orbitIntensity, setOrbitIntensity] = useState(0.6)
  const [orbitFlow, setOrbitFlow] = useState(78)
  const [pulseActive, setPulseActive] = useState(true)
  const [pulseLabel, setPulseLabel] = useState('Live')
  const [rippleLabel, setRippleLabel] = useState('Lanzar onda')
  const [staggerCount, setStaggerCount] = useState(5)
  const [staggerCadence, setStaggerCadence] = useState(120)
  const [thermoValue, setThermoValue] = useState(22)
  const [podiumFirst, setPodiumFirst] = useState(82)
  const [podiumSecond, setPodiumSecond] = useState(64)
  const [podiumThird, setPodiumThird] = useState(48)
  const [podiumBaseDuration, setPodiumBaseDuration] = useState(0.9)
  const [podiumDelayStep, setPodiumDelayStep] = useState(0.15)
  const [balloonLift, setBalloonLift] = useState(18)
  const [balloonSway, setBalloonSway] = useState(6)
  const [balloonSpeed, setBalloonSpeed] = useState(5.5)
  const [achievementProgress, setAchievementProgress] = useState(4)
  const [achievementTotal, setAchievementTotal] = useState(5)
  const [parallaxIntensity, setParallaxIntensity] = useState(10)
  const [flipValue, setFlipValue] = useState(12)
  const [stackIntensity, setStackIntensity] = useState(18)
  const [stackBlur, setStackBlur] = useState(0.6)
  const [lastEvent, setLastEvent] = useState<string | null>(null)
  const counterRef = useRef<SvelteCounterElement | null>(null)
  const orbitRef = useRef<SvelteOrbitCardElement | null>(null)
  const pulseRef = useRef<SveltePulseBadgeElement | null>(null)
  const rippleRef = useRef<SvelteRippleButtonElement | null>(null)
  const staggerRef = useRef<SvelteStaggerListElement | null>(null)
  const thermoRef = useRef<SvelteThermometerElement | null>(null)
  const podiumRef = useRef<SveltePodiumElement | null>(null)
  const balloonRef = useRef<SvelteBalloonGiftElement | null>(null)
  const achievementRef = useRef<SvelteAchievementCardElement | null>(null)
  const parallaxRef = useRef<SvelteParallaxCardElement | null>(null)
  const flipRef = useRef<SvelteFlipCounterElement | null>(null)
  const stackRef = useRef<SvelteParallaxStackElement | null>(null)

  const labEnabled =
    process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SVELTE_LAB === 'true'

  useEffect(() => {
    if (!labEnabled) return
    if (typeof window === 'undefined') return
    if (window.customElements?.get('svelte-counter')) {
      setScriptReady(true)
      return
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.src = '/svelte/svelte-lab.js'
    script.onload = () => setScriptReady(true)
    script.onerror = () => setScriptReady(false)
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [labEnabled])

  useEffect(() => {
    const el = counterRef.current
    if (!el) return
    el.name = name
    el.count = count
  }, [name, count, scriptReady])

  useEffect(() => {
    const el = orbitRef.current
    if (!el) return
    el.title = 'Focus Ring'
    el.subtitle = 'Orbita suave'
    el.intensity = orbitIntensity
    el.flow = orbitFlow
  }, [orbitIntensity, orbitFlow, scriptReady])

  useEffect(() => {
    const el = pulseRef.current
    if (!el) return
    el.label = pulseLabel
    el.tone = 'emerald'
    el.active = pulseActive
  }, [pulseLabel, pulseActive, scriptReady])

  useEffect(() => {
    const el = rippleRef.current
    if (!el) return
    el.label = rippleLabel
    el.tone = '#10b981'
  }, [rippleLabel, scriptReady])

  useEffect(() => {
    const el = staggerRef.current
    if (!el) return
    el.label = 'Batch'
    el.count = staggerCount
    el.cadence = staggerCadence
  }, [staggerCount, staggerCadence, scriptReady])

  useEffect(() => {
    const el = thermoRef.current
    if (!el) return
    el.label = 'Temperatura'
    el.min = 0
    el.max = 40
    el.value = thermoValue
  }, [thermoValue, scriptReady])

  useEffect(() => {
    const el = podiumRef.current
    if (!el) return
    el.first = podiumFirst
    el.second = podiumSecond
    el.third = podiumThird
    el.baseDuration = podiumBaseDuration
    el.delayStep = podiumDelayStep
  }, [podiumFirst, podiumSecond, podiumThird, podiumBaseDuration, podiumDelayStep, scriptReady])

  useEffect(() => {
    const el = balloonRef.current
    if (!el) return
    el.lift = balloonLift
    el.sway = balloonSway
    el.speed = balloonSpeed
    el.color = '#10b981'
    el.rope = '#94a3b8'
  }, [balloonLift, balloonSway, balloonSpeed, scriptReady])

  useEffect(() => {
    const el = achievementRef.current
    if (!el) return
    el.title = 'Nivel 5'
    el.description = 'Alcanza nivel 5 de usuario.'
    el.progress = achievementProgress
    el.total = achievementTotal
    el.xp = 15
    el.status = 'En progreso'
    el.levelIndex = 1
    el.levelTotal = 3
  }, [achievementProgress, achievementTotal, scriptReady])

  useEffect(() => {
    const el = parallaxRef.current
    if (!el) return
    el.title = 'Pulso Focus'
    el.value = '78%'
    el.hint = 'Calma sostenida'
    el.intensity = parallaxIntensity
  }, [parallaxIntensity, scriptReady])

  useEffect(() => {
    const el = flipRef.current
    if (!el) return
    el.label = 'Sesiones'
    el.value = flipValue
    el.tone = '#10b981'
  }, [flipValue, scriptReady])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return
    el.title = 'Capas activas'
    el.intensity = stackIntensity
    el.blur = stackBlur
  }, [stackIntensity, stackBlur, scriptReady])

  useEffect(() => {
    const el = counterRef.current
    if (!el) return
    const handlePing = (event: Event) => {
      const detail = (event as CustomEvent).detail
      setLastEvent(`ping: ${JSON.stringify(detail)}`)
    }
    el.addEventListener('ping', handlePing)
    return () => {
      el.removeEventListener('ping', handlePing)
    }
  }, [scriptReady])

  useEffect(() => {
    const el = orbitRef.current
    if (!el) return
    const handleHover = (event: Event) => {
      const detail = (event as CustomEvent).detail
      setLastEvent(`hover: ${JSON.stringify(detail)}`)
    }
    el.addEventListener('hover', handleHover)
    return () => {
      el.removeEventListener('hover', handleHover)
    }
  }, [scriptReady])

  useEffect(() => {
    const el = pulseRef.current
    if (!el) return
    const handleToggle = (event: Event) => {
      const detail = (event as CustomEvent).detail
      setPulseActive(Boolean(detail?.active))
      setLastEvent(`toggle: ${JSON.stringify(detail)}`)
    }
    el.addEventListener('toggle', handleToggle)
    return () => {
      el.removeEventListener('toggle', handleToggle)
    }
  }, [scriptReady])

  useEffect(() => {
    const el = rippleRef.current
    if (!el) return
    const handleRipple = (event: Event) => {
      const detail = (event as CustomEvent).detail
      setLastEvent(`ripple: ${JSON.stringify(detail)}`)
    }
    el.addEventListener('ripple', handleRipple)
    return () => {
      el.removeEventListener('ripple', handleRipple)
    }
  }, [scriptReady])

  useEffect(() => {
    const el = staggerRef.current
    if (!el) return
    const handleRefresh = (event: Event) => {
      const detail = (event as CustomEvent).detail
      setLastEvent(`refresh: ${JSON.stringify(detail)}`)
    }
    el.addEventListener('refresh', handleRefresh)
    return () => {
      el.removeEventListener('refresh', handleRefresh)
    }
  }, [scriptReady])

  const statusText = useMemo(() => {
    if (!labEnabled) return 'Deshabilitado en producción.'
    if (!scriptReady) return 'Cargando bundle Svelte...'
    return 'Listo.'
  }, [labEnabled, scriptReady])

  return (
    <div className="py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Lab Svelte (Web Components)</h1>
        <p className="mt-2 text-sm text-gray-600">
          Zona de pruebas para renderizar componentes Svelte dentro de React.
        </p>
        <p className="mt-1 text-xs text-gray-500">Estado: {statusText}</p>
      </div>

      <section className="grid gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-medium text-gray-500">Ultimo evento</label>
          <div className="mt-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            {lastEvent ?? 'Sin eventos'}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Render del Web Component (tag: <span className="font-mono">svelte-counter</span>)
          </div>
          <div className="rounded-lg border border-emerald-200 bg-white p-6 shadow-inner">
            <svelte-counter ref={counterRef} />
          </div>
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Prop name</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nombre"
            />
            <label className="text-xs font-medium text-gray-500">Prop count</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              min={0}
            />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Orbita suave (tag: <span className="font-mono">svelte-orbit-card</span>)
          </div>
          <svelte-orbit-card ref={orbitRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Orbit intensity</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              className="mt-1 w-full"
              value={orbitIntensity}
              onChange={(event) => setOrbitIntensity(Number(event.target.value))}
            />
            <label className="text-xs font-medium text-gray-500">Orbit flow</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={orbitFlow}
              onChange={(event) => setOrbitFlow(Number(event.target.value))}
              min={0}
              max={100}
            />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Pulse badge (tag: <span className="font-mono">svelte-pulse-badge</span>)
          </div>
          <svelte-pulse-badge ref={pulseRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Pulse label</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={pulseLabel}
              onChange={(event) => setPulseLabel(event.target.value)}
            />
            <label className="inline-flex items-center gap-2 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={pulseActive}
                onChange={(event) => setPulseActive(event.target.checked)}
              />
              Activo
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Ripple button (tag: <span className="font-mono">svelte-ripple-button</span>)
          </div>
          <svelte-ripple-button ref={rippleRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Ripple label</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={rippleLabel}
              onChange={(event) => setRippleLabel(event.target.value)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Stagger list (tag: <span className="font-mono">svelte-stagger-list</span>)
          </div>
          <svelte-stagger-list ref={staggerRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Stagger count</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={staggerCount}
              onChange={(event) => setStaggerCount(Number(event.target.value))}
              min={1}
              max={12}
            />
            <label className="text-xs font-medium text-gray-500">Stagger cadence (ms)</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={staggerCadence}
              onChange={(event) => setStaggerCadence(Number(event.target.value))}
              min={50}
              max={400}
            />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Termometro animado (tag: <span className="font-mono">svelte-thermometer</span>)
          </div>
          <svelte-thermometer ref={thermoRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Thermometer value</label>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              className="mt-2 w-full"
              value={thermoValue}
              onChange={(event) => setThermoValue(Number(event.target.value))}
            />
            <div className="text-xs text-gray-500">{thermoValue} C</div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Podio animado (tag: <span className="font-mono">svelte-podium</span>)
          </div>
          <svelte-podium ref={podiumRef} />
          <div className="mt-4 grid gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Podium heights</label>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                <input
                  type="number"
                  className="rounded border border-gray-200 px-2 py-1"
                  value={podiumFirst}
                  onChange={(event) => setPodiumFirst(Number(event.target.value))}
                  min={20}
                  max={100}
                />
                <input
                  type="number"
                  className="rounded border border-gray-200 px-2 py-1"
                  value={podiumSecond}
                  onChange={(event) => setPodiumSecond(Number(event.target.value))}
                  min={20}
                  max={100}
                />
                <input
                  type="number"
                  className="rounded border border-gray-200 px-2 py-1"
                  value={podiumThird}
                  onChange={(event) => setPodiumThird(Number(event.target.value))}
                  min={20}
                  max={100}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Podium timing</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step={0.1}
                  className="rounded border border-gray-200 px-2 py-1 text-xs"
                  value={podiumBaseDuration}
                  onChange={(event) => setPodiumBaseDuration(Number(event.target.value))}
                  min={0.4}
                  max={2.4}
                />
                <input
                  type="number"
                  step={0.05}
                  className="rounded border border-gray-200 px-2 py-1 text-xs"
                  value={podiumDelayStep}
                  onChange={(event) => setPodiumDelayStep(Number(event.target.value))}
                  min={0}
                  max={0.6}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Globo flotante (tag: <span className="font-mono">svelte-balloon-gift</span>)
          </div>
          <svelte-balloon-gift ref={balloonRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Balloon lift</label>
            <input
              type="range"
              min={6}
              max={32}
              step={1}
              className="mt-1 w-full"
              value={balloonLift}
              onChange={(event) => setBalloonLift(Number(event.target.value))}
            />
            <label className="text-xs font-medium text-gray-500">Balloon sway</label>
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              className="mt-1 w-full"
              value={balloonSway}
              onChange={(event) => setBalloonSway(Number(event.target.value))}
            />
            <label className="text-xs font-medium text-gray-500">Balloon speed (s)</label>
            <input
              type="number"
              step={0.5}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={balloonSpeed}
              onChange={(event) => setBalloonSpeed(Number(event.target.value))}
              min={2}
              max={10}
            />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Tarjeta de logro (tag: <span className="font-mono">svelte-achievement-card</span>)
          </div>
          <svelte-achievement-card ref={achievementRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Achievement progress</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className="rounded border border-gray-200 px-2 py-1 text-xs"
                value={achievementProgress}
                onChange={(event) => setAchievementProgress(Number(event.target.value))}
                min={0}
              />
              <input
                type="number"
                className="rounded border border-gray-200 px-2 py-1 text-xs"
                value={achievementTotal}
                onChange={(event) => setAchievementTotal(Number(event.target.value))}
                min={1}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Parallax card (tag: <span className="font-mono">svelte-parallax-card</span>)
          </div>
          <svelte-parallax-card ref={parallaxRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Parallax intensity</label>
            <input
              type="range"
              min={4}
              max={18}
              step={1}
              className="w-full"
              value={parallaxIntensity}
              onChange={(event) => setParallaxIntensity(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Flip counter (tag: <span className="font-mono">svelte-flip-counter</span>)
          </div>
          <svelte-flip-counter ref={flipRef} />
          <div className="mt-4 grid gap-2">
            <label className="text-xs font-medium text-gray-500">Counter value</label>
            <input
              type="number"
              className="rounded border border-gray-200 px-2 py-1 text-xs"
              value={flipValue}
              onChange={(event) => setFlipValue(Number(event.target.value))}
              min={0}
            />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">
            Parallax stack (tag: <span className="font-mono">svelte-parallax-stack</span>)
          </div>
          <svelte-parallax-stack ref={stackRef} />
          <div className="mt-4 grid gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Stack intensity</label>
              <input
                type="range"
                min={6}
                max={26}
                step={1}
                className="w-full"
                value={stackIntensity}
                onChange={(event) => setStackIntensity(Number(event.target.value))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Stack blur</label>
              <input
                type="range"
                min={0}
                max={1.2}
                step={0.1}
                className="w-full"
                value={stackBlur}
                onChange={(event) => setStackBlur(Number(event.target.value))}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
