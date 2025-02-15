"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

// Extend the Window interface to include the Wistia property
declare global {
    interface Window {
        _wq: any[]
        Wistia?: {
            api: (hashedId: string) => any
        }
    }
}

interface WistiaModalProps {
    hashedId: string
    onClose: () => void
    onVideoEnd?: () => void
}

export function WistiaModalNotification({ hashedId, onClose, onVideoEnd }: WistiaModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const [isVideoReady, setIsVideoReady] = useState(false)

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://fast.wistia.com/assets/external/E-v1.js"
        script.async = true
        document.body.appendChild(script)

        script.onload = () => {
            setIsVideoReady(true)
        }

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    useEffect(() => {
        if (!isVideoReady) return

        window._wq = window._wq || []
        window._wq.push({
            id: hashedId,
            onReady: (video: any) => {
                console.log("Wistia video ready:", hashedId)
                video.bind("end", () => {
                    console.log("Wistia video ended:", hashedId)
                    onVideoEnd?.()
                })
            },
        })

        return () => {
            // Clean up the video when component unmounts
            if (window.Wistia && window.Wistia.api) {
                const video = window.Wistia.api(hashedId)
                if (video) {
                    video.unbind("end")
                    video.remove()
                }
            }
        }
    }, [hashedId, onVideoEnd, isVideoReady])

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
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
            <div ref={modalRef} className="relative z-10 w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    aria-label="Close video"
                >
                    <X size={24} />
                </button>
                {isVideoReady && (
                    <div className="wistia_responsive_padding" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                        <div
                            className="wistia_responsive_wrapper"
                            style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "100%" }}
                        >
                            <div
                                className={`wistia_embed wistia_async_${hashedId} videoFoam=true`}
                                style={{ height: "100%", width: "100%" }}
                            >
                                &nbsp;
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

