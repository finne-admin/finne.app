import { Layout } from '@/components/layout'
import React from "react";
import FirebaseMessagingInitializer from "@/components/FirebaseMessagingInitializer";

export default function AuthenticatedLayout({
                                                children,
                                            }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <Layout>
            <FirebaseMessagingInitializer/>
            {children}
        </Layout>
    )
}