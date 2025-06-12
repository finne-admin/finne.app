// components/tutorial/useTutorial.ts
import { useState } from "react"

export function useTutorialState() {
  const [isOpen, setIsOpen] = useState(false)

  const startTutorial = () => setIsOpen(true)
  const stopTutorial = () => setIsOpen(false)

  return { isOpen, startTutorial, stopTutorial }
}   
