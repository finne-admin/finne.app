import { useState } from 'react'

export function useTutorialState() {
  const [isOpen, setIsOpen] = useState(false)

  const startTutorial = () => {
    localStorage.removeItem("tutorialShown") // Eliminar el flag
    setIsOpen(true)
  }

  const stopTutorial = () => {
    localStorage.setItem("tutorialShown", "true") // Guardar que ya se mostró
    setIsOpen(false)
  }

  return { isOpen, startTutorial, stopTutorial }
}
