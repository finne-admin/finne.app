"use client";

import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";
import { PerfilResumenRefProvider } from "@/context/useProfileSummaryRef";

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

      <body className="min-h-screen bg-white text-black">
        <PerfilResumenRefProvider>
          <Toaster richColors />

          <div id="puntos-globales" className="pointer-events-none fixed inset-0 z-[9999]" />

          <main className="h-full min-h-dvh w-full">{children}</main>
        </PerfilResumenRefProvider>
      </body>
    </html>
  );
}
