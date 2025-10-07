// next.config.mjs
import nextPwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const withPWA = nextPwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // no SW en dev
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'embed-ssl.wistia.com',
      },
      {
        protocol: 'https',
        hostname: 'embed.wistia.com',
      },
    {
      protocol: 'http',   // 👈 añade este
      hostname: 'embed.wistia.com',
    },
      {
        protocol: 'https',
        hostname: 'cgpqlasmzpabwrubvhyl.supabase.co',
      },
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
  },
}

// Wrap your config with next-pwa
export default withPWA(nextConfig)
