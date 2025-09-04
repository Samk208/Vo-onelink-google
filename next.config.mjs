/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Ensure environment variables are properly loaded
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // For better debugging in development
  ...(process.env.NODE_ENV === 'development' && {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  }),
}

export default nextConfig
