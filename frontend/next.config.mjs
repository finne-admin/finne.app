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

  // 👇 evita fallos en build de Cloud Run
  output: "standalone",
  
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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/notifications",
        permanent: true,
      },
    ]
  },
}

// Wrap your config with next-pwa
export default withPWA(nextConfig)
