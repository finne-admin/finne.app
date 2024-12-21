'use client'

import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

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

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    // Initialize the Supabase client with Auth Helpers
    const supabase = createClientComponentClient()

    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*
          SessionContextProvider makes the session available in React context.
          Supabase client tokens are synced into cookies, enabling the middleware
          to authenticate users server-side.
        */}
        <SessionContextProvider supabaseClient={supabase}>
            {children}
        </SessionContextProvider>
        </body>
        </html>
    );
}
