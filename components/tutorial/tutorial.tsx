// components/tutorial/Tutorial.tsx
"use client"

import React, { useEffect, useState } from "react"
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface TutorialProps {
  onClose: () => void
}

export function Tutorial({ onClose }: TutorialProps) {
  const router = useRouter()
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    async function fetchRole() {
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
          target: ".text-gray-400.placeholder-gray-400",
          title: "Buscador",
          content: "Puedes buscar ejercicios o contenido rápidamente desde aquí."
        },
        {
          target: ".text-gray-600 svg:nth-child(3)",
          title: "Notificaciones",
          content: "Aquí recibirás recordatorios para tu pausa activa."
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
          target: "a[href='/milestones']",
          title: "Logros",
          content: "Visualiza tus progresos y premios acumulados."
        },
        {
          target: "a[href='/settings']",
          title: "Ajustes",
          content: "Cambia tu perfil, notificaciones y preferencias."
        }
      ]

      const adminStep: Step = {
        target: "a[href='/admin']",
        title: "Panel de Administrador",
        content: "Desde aquí gestionas empleados y monitorizas la actividad."
      }

      const finalSteps = isAdmin
        ? [...commonSteps.slice(0, 5), adminStep, ...commonSteps.slice(5)]
        : commonSteps

      setSteps(finalSteps)
    }

    fetchRole()
  }, [])

  const handleCallback = (data: CallBackProps) => {
    const { status } = data
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onClose()
    }
  }

  if (steps.length === 0) return null

  return (
    <Joyride
      steps={steps}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#5BA69B",
          textColor: "#333",
          arrowColor: "#fff",
          backgroundColor: "#fff"
        }
      }}
      callback={handleCallback}
    />
  )
}
