// next.config.mjs

import nextPwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const withPWA = nextPwa({
    // Where to generate the service worker
    dest: 'public',

    // Automatically register SW on client
    register: true,

    // Prompt new service worker to take over immediately
    skipWaiting: true,

    // (Optional) runtimeCaching or additional Workbox config here
    // runtimeCaching: [...]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true
    },
    images: {
        domains: ['embed-ssl.wistia.com', 'embed.wistia.com'],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/notification",
                permanent: true, // Use true for 308 status code (permanent redirect), false for 307 (temporary)
            },
        ]
    }
}

// Wrap your config with next-pwa
export default withPWA(nextConfig)
