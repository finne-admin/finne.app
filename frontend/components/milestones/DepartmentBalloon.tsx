'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'

type Props = {
  goal?: number
  className?: string
  height?: number
  ceilingPx?: number   // altura a evitar desde arriba (px)
  showInlineCount?: boolean   // <— NUEVO
}

export default function CerditoGlobo({
  goal = 2400,
  className,
  height = 800,
  ceilingPx = 0,
  showInlineCount = false,     // <— por defecto ya va fuera

}: Props) {
  const [totalExp, setTotalExp] = useState<number | null>(null)
  const [ropePath, setRopePath] = useState<string>('')

  const containerRef = useRef<HTMLDivElement>(null)
  const attachRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rot = useMotionValue(0)

  const pos = useRef({ x: 0, y: 0 })
  const vel = useRef({ x: 0, y: 0 })
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })

  // -------- Parámetros ----------
  const ROPE_RATIO = 0.9
  const STRING_LENGTH = height * ROPE_RATIO

  // Inercia + fuerzas
  const MASS = 3.1
  const BUOYANCY = 0.018
  const MOUSE_FORCE = 80
  const MOUSE_RADIUS = 90
  const BREEZE = 0.03
  const MAX_SPEED = 0.35

  // Punto de enganche respecto al centro del globo (antes de escalar)
  const ATTACH_X = -2
  const ATTACH_Y = 34

  // guiado / centrado
  const HOMING_K = 0.006          // guiado solo durante la subida
  const CENTERING_K = 0.0012      // durante subida
  const BASE_CENTERING_K = 0.0006 // centrado muy suave siempre

  // resorte radial + holgura
  const LENGTH_SPRING_K = 0.0025
  const SLACK = 16

  // amortiguación
  const DAMPING_X = 0.994
  const DAMPING_Y = 0.995

  // “side guard”: crece cerca de paredes
  const WALL_MARGIN_RATIO = 0.18
  const WALL_K = 0.02
  const WALL_EXP = 2.2

  // Subida inicial (crecimiento de cuerda)
  const RISE_DURATION_MS = 1800
  const START_LENGTH_FACTOR = 0.4
  const riseElapsed = useRef(0)
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

  // Texto proporcional al globo
  const PIG_BASE_PX = 220
  const TEXT_RATIO = 0.08
  const TEXT_OFFSET_RATIO = 0.07

  // -------- Datos ----------
  useEffect(() => {
    const fetchTotal = async () => {
      const supabase = createClientComponentClient()
      const { data } = await supabase.from('users').select('periodical_exp')
      if (data) {
        const total = data.reduce(
          (acc, r: { periodical_exp: number | null }) => acc + (r.periodical_exp ?? 0),
          0
        )
        setTotalExp(total)
      }
    }
    fetchTotal()
  }, [])

  const progress = Math.max(0, Math.min(1, (totalExp ?? 0) / goal))
  const scale = 0.85 + 0.6 * progress

  const textPx = PIG_BASE_PX * scale * TEXT_RATIO
  const textOffset = PIG_BASE_PX * scale * TEXT_OFFSET_RATIO

  // Posición inicial
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    pos.current.x = el.clientWidth / 2
    pos.current.y = el.clientHeight - 12
    x.set(pos.current.x)
    y.set(pos.current.y)
    riseElapsed.current = 0
  }, [x, y])

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    mouse.current.x = e.clientX - rect.left
    mouse.current.y = e.clientY - rect.top
  }
  const onMouseLeave = () => {
    mouse.current.x = null
    mouse.current.y = null
  }

  // -------- Animación / física ----------
  useAnimationFrame((t, deltaMs) => {
    const el = containerRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight
    const dt = Math.min(32, deltaMs)

    const ax = w / 2
    const ay = h - 2

    // helper para aplicar fuerzas con masa y dt
    const applyForce = (fx: number, fy: number) => {
      vel.current.x += (fx / MASS) * dt
      vel.current.y += (fy / MASS) * dt
    }

    // Longitud base con subida inicial
    riseElapsed.current = Math.min(RISE_DURATION_MS, riseElapsed.current + dt)
    const k = easeOut(riseElapsed.current / RISE_DURATION_MS) // 0..1
    const guide = 1 - k                                      // guiado se desvanece
    const lengthFactor = START_LENGTH_FACTOR + (1 - START_LENGTH_FACTOR) * k
    const EFFECTIVE_LENGTH = STRING_LENGTH * lengthFactor

    // Limitar por el "techo" (contador)
    const TOP_SAFE = Math.max(0, ceilingPx) + 6              // margen extra
    const maxLengthByCeiling = Math.max(40, ay - TOP_SAFE)   // lo que cabe entre ancla y techo
    const L = Math.min(EFFECTIVE_LENGTH, maxLengthByCeiling) // longitud REAL a usar

    // Fuerzas base
    applyForce(0, -BUOYANCY * (1 + progress))

    // Ratón
    if (mouse.current.x !== null && mouse.current.y !== null) {
      const rx = pos.current.x - mouse.current.x!
      const ry = pos.current.y - mouse.current.y!
      const r = Math.hypot(rx, ry)
      if (r < MOUSE_RADIUS && r > 0.001) {
        const inv = 1 - r / MOUSE_RADIUS
        const falloff = inv * inv
        applyForce((rx / r) * MOUSE_FORCE * falloff / 1000, (ry / r) * MOUSE_FORCE * falloff / 1000)
      }
    }

    // Brisa
    const breeze = (Math.sin(t / 16000) + (Math.random() - 0.5) * 0.1) * BREEZE
    applyForce(breeze, 0)

    // Integrar tentativa
    let nx = pos.current.x + vel.current.x
    let ny = pos.current.y + vel.current.y

    // Punto de enganche tentativo
    const ox = ATTACH_X * scale
    const oy = ATTACH_Y * scale
    const attachX = nx + ox
    const attachY = ny + oy

    const dx = attachX - ax
    const dy = attachY - ay
    const dist = Math.hypot(dx, dy)

    // 1) Guiado SOLO durante la subida (se desvanece) → usa L
    const targetAttachX = ax
    const targetAttachY = ay - L
    applyForce(HOMING_K * guide * (targetAttachX - attachX), HOMING_K * guide * (targetAttachY - attachY))

    // 2) Centrado lateral: suave siempre + algo más mientras sube
    applyForce(-(BASE_CENTERING_K + CENTERING_K * guide) * dx, 0)

    // 3) Side Guard: fuerza que crece al acercarse a los lados
    const wallMargin = w * WALL_MARGIN_RATIO
    const leftSafe = 24
    const rightSafe = w - 24
    const distLeft = Math.max(0, attachX - leftSafe)
    const distRight = Math.max(0, rightSafe - attachX)
    const proxLeft = 1 - Math.min(1, distLeft / wallMargin)  // 1 pegado, 0 lejos
    const proxRight = 1 - Math.min(1, distRight / wallMargin)
    const guardForce = WALL_K * (Math.pow(proxRight, WALL_EXP) - Math.pow(proxLeft, WALL_EXP))
    applyForce(guardForce, 0)

    // 4) Resorte radial si está floja → usa L
    if (dist < L - SLACK) {
      const ux = dx / (dist || 1)
      const uy = dy / (dist || 1)
      const stretch = (L - SLACK) - dist
      applyForce(LENGTH_SPRING_K * stretch * ux, LENGTH_SPRING_K * stretch * uy)
    }

    // 5) Restricción si se pasa (proyectar + quitar vel radial) → usa L
    if (dist > L) {
      const ux = dx / dist
      const uy = dy / dist
      const px = ax + ux * L
      const py = ay + uy * L
      nx = px - ox
      ny = py - oy
      const vdot = vel.current.x * ux + vel.current.y * uy
      vel.current.x -= vdot * ux
      vel.current.y -= vdot * uy
    }

    // Amortiguación
    vel.current.x *= DAMPING_X
    vel.current.y *= DAMPING_Y

    // Límites + cap
    nx = Math.max(24, Math.min(w - 24, nx))
    ny = Math.max(24, Math.min(h - 24, ny))
    const speed = Math.hypot(vel.current.x, vel.current.y) / dt
    if (speed > MAX_SPEED && speed > 0) {
      const s = (MAX_SPEED * dt) / (speed * dt)
      vel.current.x *= s
      vel.current.y *= s
    }

    // Aplicar
    pos.current.x = nx
    pos.current.y = ny
    x.set(nx)
    y.set(ny)
    rot.set(vel.current.x * 0.05)

    // Cuerda
    const bx = nx + ox
    const by = ny + oy
    attachRef.current.x = bx
    attachRef.current.y = by

    const cx = (ax + bx) / 2
    const cy = Math.max(ay, by) - Math.abs(bx - ax) * 0.08
    setRopePath(`M ${ax},${ay} Q ${cx},${cy} ${bx},${by}`)
  })

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={['relative mx-auto overflow-visible', className].filter(Boolean).join(' ')}
      style={{ height }}
      aria-live="polite"
    >
      {/* cuerda */}
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        <path d={ropePath} stroke="#9ca3af" strokeWidth={3} strokeDasharray="2 6" fill="none" />
      </svg>

      {/* globo */}
      <motion.div
        className="absolute will-change-transform"
        style={{
          x,
          y,
          rotate: rot,
          translateX: '-50%',
          translateY: '-50%',
          transformOrigin: '50% 55%',
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 12 }}
      >
        <div className="relative" style={{ transform: `scale(${scale})` }}>
          <Image
            src="/gift.png"          
            alt="Cerdito-globo del departamento"
            width={800}
            height={800}
            className="w-[220px] h-auto select-none"
            priority
          />
          {showInlineCount && (
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <span
                className="text-white font-bold"
                style={{ fontSize: `${textPx}px`, transform: `translateY(${textOffset}px)`, lineHeight: 1, letterSpacing: '0.02em' }}
              >
                {totalExp === null ? '—/—' : `${totalExp}/${goal}`}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ancla en el suelo */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2 h-2 rounded-full bg-gray-500" />
    </div>
  )
}
