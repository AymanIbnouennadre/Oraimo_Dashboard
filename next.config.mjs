/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
      {
        source: '/dashboard/images/:path*',
        destination: '/api/images/:path*',
      },
    ]
  },
}

export default nextConfig
