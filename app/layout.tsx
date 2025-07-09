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
            {children}
          </PerfilResumenRefProvider>
        </SessionContextProvider>
      </body>
    </html>
  )
}
