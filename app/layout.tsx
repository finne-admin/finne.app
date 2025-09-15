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


// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full min-h-dvh w-full bg-gray-50 overflow-x-hidden`}>
        <SessionContextProvider supabaseClient={supabase}>
          <PerfilResumenRefProvider>
            <Toaster />
            <div id="puntos-globales" className="pointer-events-none fixed inset-0 z-[9999]" />
            <main className="h-full min-h-dvh w-full">{children}</main>
          </PerfilResumenRefProvider>
        </SessionContextProvider>
      </body>
    </html>
  )
}

