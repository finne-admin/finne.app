// components/tutorial/Tutorial.tsx
"use client"

import React, { useEffect, useState } from "react"
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface TutorialProps {
  onClose: () => void
  run: boolean
}

export function Tutorial({ onClose, run }: TutorialProps) {
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    async function fetchRoleAndInit() {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      const isAdmin = userData?.role === "admin"

      const commonSteps: Step[] = [
        {
          target: "body",
          placement: "center",
          title: "¡Bienvenido!",
          content: "Este breve tutorial te guiará por las funciones principales de Finne."
        },
        {
          target: 'body',
          placement: 'center',
          title: "Activa las notificaciones del navegador",
          content: (
            <div className="text-sm">
              <p className="mb-3">
                Para recibir recordatorios, haz clic en el icono de opciones de la barra del navegador (arriba a la izquierda o a la derecha) y permite las notificaciones.
              </p>
              <img
                src="permiso-notificaciones.png"
                alt="Activar notificaciones"
                className="rounded-md border shadow w-full max-w-xs mx-auto"
              />
            </div>
          )
        },
        {
          target: "a[href='/notifications']",
          title: "Pausa Activa",
          content: "Desde aquí accedes a tus sesiones diarias."
        },
        {
          target: "a[href='/library']",
          title: "Biblioteca",
          content: "Explora todos los ejercicios disponibles."
        },
        {
          target: "a[href='/statistics']",
          title: "Estadísticas",
          content: "Consulta tus progresos y métricas de actividad."
        },
        {
          target: "a[href='/settings']",
          title: "Ajustes",
          content: "Cambia tu perfil, notificaciones y preferencias."
        },
        {
          target: "a[href='/milestones']",
          title: "Logros",
          content: "Visualiza tus progresos y premios acumulados."
        }
      ]

      const adminStep: Step = {
        target: "a[href='/admin']",
        title: "Panel de Administrador",
        content: "Desde aquí gestionas empleados y monitorizas la actividad."
      }

      const finalSteps = isAdmin ? [...commonSteps, adminStep] : commonSteps
      setSteps(finalSteps)
    }

    fetchRoleAndInit()
  }, [])

  const handleCallback = (data: CallBackProps) => {
    const { status } = data
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem("tutorial_shown", "true")
      onClose()
    }
  }

  if (!run || steps.length === 0) return null

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      scrollToFirstStep
      showProgress={false}
      showSkipButton
      spotlightPadding={10}
      spotlightClicks={true}
      disableScrolling={false}
      disableOverlayClose={true}
      locale={{
        back: "Atrás",
        close: "Cerrar",
        last: "Finalizar",
        next: "Siguiente",
        skip: "Saltar"
      }}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#5BA69B",
          textColor: "#333",
          arrowColor: "#fff",
          backgroundColor: "#fff",
          overlayColor: "rgba(0, 0, 0, 0.4)"
        }
      }}
      callback={handleCallback}
    />
  )
}
