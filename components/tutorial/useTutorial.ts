import { useState } from 'react'

export function useTutorialState() {
  const [isOpen, setIsOpen] = useState(false)

  const startTutorial = () => {
    localStorage.removeItem("tutorial_shown") // Eliminar el flag
    setIsOpen(true)
  }

  const stopTutorial = () => {
    localStorage.setItem("tutorial_shown", "true") // Guardar que ya se mostró
    setIsOpen(false)
  }

  return { isOpen, startTutorial, stopTutorial }
}
