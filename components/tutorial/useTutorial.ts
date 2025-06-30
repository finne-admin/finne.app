import { useEffect, useState } from 'react'

export function useTutorialState() {
  const [isOpen, setIsOpen] = useState(false)

  // ✅ Ejecutar solo al primer render del hook
  useEffect(() => {
    const shown = localStorage.getItem("tutorial_shown")
    if (!shown) {
      setIsOpen(true)
    }
  }, [])

  const startTutorial = () => {
    localStorage.removeItem("tutorial_shown")
    setIsOpen(true)
  }

  const stopTutorial = () => {
    localStorage.setItem("tutorial_shown", "true")
    setIsOpen(false)
  }

  return { isOpen, startTutorial, stopTutorial }
}
