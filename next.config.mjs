// next.config.mjs

import nextPwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const withPWA = nextPwa({
    dest: 'public',
    register: true,
    skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true
    },
    images: {
        domains: [
            'embed-ssl.wistia.com',
            'embed.wistia.com',
            'cgpqlasmzpabwrubvhyl.supabase.co' // añadido dominio de Supabase
        ],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/notification",
                permanent: true,
            },
        ]
    }
}

// Wrap your config with next-pwa
export default withPWA(nextConfig)
