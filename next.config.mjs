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
  async redirects() {
    return [
      {
        source: '/superuser',
        destination: '/superuser/dashboard',
        permanent: true,
      },
      {
        source: '/superuser/login',
        destination: '/superuser/dashboard',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
