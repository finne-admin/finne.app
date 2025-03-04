"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface WistiaModalProps {
    hashedId: string
    onClose: () => void
}

export function WistiaModal({ hashedId, onClose }: Readonly<WistiaModalProps>) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener("keydown", handleEscape)
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div ref={modalRef} className="relative z-10 w-full max-w-4xl aspect-video">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
                    aria-label="Close video"
                >
                    <X size={24} />
                </button>
                <iframe
                    title={`Video ejercicio`}
                    src={`https://fast.wistia.net/embed/iframe/${hashedId}?videoFoam=true`}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        </div>
    )
}