"use client";

import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";
import { PerfilResumenRefProvider } from "@/context/useProfileSummaryRef";
import { UnclaimedProgressProvider } from "@/components/providers/UnclaimedProgressProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      {/* 👇 Recuperamos EXACTAMENTE la estructura del layout antiguo */}
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased
          h-full min-h-dvh w-full
          bg-gray-50
          overflow-x-hidden
        `}
      >
        <PerfilResumenRefProvider>
          <UnclaimedProgressProvider>
            <Toaster richColors />

            {/* capa global */}
            <div
              id="puntos-globales"
              className="pointer-events-none fixed inset-0 z-[9999]"
            />

            {/* 👇 RESTAURACIÓN CLAVE: <main> con h-full + min-h-dvh */}
            <main className="h-full min-h-dvh w-full">
              {children}
            </main>
          </UnclaimedProgressProvider>
        </PerfilResumenRefProvider>
      </body>
    </html>
  );
}
