'use client'

import localFont from "next/font/local"
import "./globals.css"
import React from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Toaster } from "sonner"
import { PerfilResumenRefProvider } from '@/context/usePerfilResumenRef'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createClientComponentClient()

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <SessionContextProvider supabaseClient={supabase}>
          <PerfilResumenRefProvider> {/* 👈 Ahora está envuelto aquí */}
            <Toaster />
            <div id="puntos-globales" className="pointer-events-none fixed inset-0 z-[9999]" />
            {children}
          </PerfilResumenRefProvider>

          {/* Filtro SVG global para efecto "melting" */}
          <svg
            aria-hidden="true"
            focusable="false"
            width="0"
            height="0"
            style={{ position: 'fixed' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter
                id="melt-warp"
                x="-20%" y="-20%" width="140%" height="140%"    // margen para que no se “corte”
                colorInterpolationFilters="sRGB"                 // colores más fieles
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.008 0.012"
                  numOctaves="2"
                  seed="2"
                  result="turb"
                >
                  <animate
                    attributeName="baseFrequency"
                    dur="6s"
                    values="0.008 0.012; 0.012 0.009; 0.008 0.012"
                    repeatCount="indefinite"
                  />
                </feTurbulence>

                <feDisplacementMap
                  in="SourceGraphic"
                  in2="turb"
                  scale="8"
                  xChannelSelector="R"
                  yChannelSelector="G"
                >
                  <animate
                    attributeName="scale"
                    values="6;10;6"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </feDisplacementMap>
              </filter>
            </defs>
          </svg>

        </SessionContextProvider>
      </body>
    </html>
  )
}
