"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {Button} from "@chakra-ui/react";

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
    isLoading?: boolean
}

export function WistiaModalNotification({
                                            hashedId,
                                            onClose,
                                            onVideoEnd,
                                            isLoading = false
                                        }: WistiaModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<any>(null)
    const [isVideoReady, setIsVideoReady] = useState(false)
    const [error, setError] = useState("")

    if (typeof window !== 'undefined') {
        window._wq = window._wq || []
    }

    // Shared script loading
    useEffect(() => {
        if (document.querySelector("#wistia-script")) {
            setIsVideoReady(true)
            return
        }

        const script = document.createElement("script")
        script.id = "wistia-script"
        script.src = "https://fast.wistia.com/assets/external/E-v1.js"
        script.async = true
        script.onerror = () => setError("Failed to load video player")

        document.body.appendChild(script)
        script.onload = () => {
            setIsVideoReady(true)
            window._wq = window._wq || []
        }

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    // Video initialization
    useEffect(() => {
    if (!isVideoReady || isLoading || !hashedId) return;

    let destroyed = false;
    let player: any = null;

    const initPlayer = () => {
        if (destroyed) return;

        (window as any)._wq = (window as any)._wq || [];
        (window as any)._wq.push({
        id: hashedId,
        options: {
            autoPlay: true,
            playbar: true,
            volumeControl: true,
            fullscreenButton: true,
        },
        onReady: (video: any) => {
            if (destroyed || !video) return;

            player = video;
            videoRef.current = video;

            try { video.play?.(); } catch {}

            // 🔐 Opción A: usar 'afterend' para evitar la carrera interna de Wistia
            video.bind("afterend", () => {
            onVideoEnd?.();
            video.unbind("afterend"); // limpieza
            });
        },
        });
    };

    initPlayer();

    return () => {
        destroyed = true;
        try {
        player?.unbind?.("afterend");
        player?.unbind?.("end");     // por si acaso estaba bindeado
        player?.remove?.();
        } finally {
        videoRef.current = null;
        player = null;
        }
    };
    }, [hashedId, onVideoEnd, isVideoReady, isLoading]);



    // Event handlers
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) onClose()
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current &&
                !modalRef.current.contains(e.target as Node) &&
                !isLoading
            ) {
                onClose()
            }
        }

        document.addEventListener("keydown", handleKeydown)
        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener("keydown", handleKeydown)
            document.removeEventListener("click", handleClickOutside)
        }
    }, [onClose, isLoading])

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                <div className="relative z-10 bg-white p-8 rounded-xl max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Playback Error</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

            <div
                ref={modalRef}
                className={cn(
                    "relative z-10 w-full max-w-4xl bg-black rounded-xl overflow-hidden",
                    "transform transition-all duration-300 ease-out",
                    isLoading ? "scale-95 opacity-0" : "scale-100 opacity-100"
                )}
            >
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className={cn(
                        "absolute top-4 right-4 p-2 text-white/80",
                        "hover:bg-white/10 rounded-full transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-white/50",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-label="Close video"
                >
                    <X size={24} />
                </button>

                {(isLoading || !isVideoReady) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                    </div>
                )}

                <div className="wistia_responsive_padding" style={{ padding: "56.25% 0 0 0" }}>
                    <div className="wistia_responsive_wrapper">
                        <div
                            className={`wistia_embed wistia_async_${hashedId} videoFoam=true`}
                            style={{ visibility: isLoading ? "hidden" : "visible" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}