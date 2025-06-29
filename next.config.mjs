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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oims-4510ba404e0e.herokuapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      // Allow common image hosting services for fundraiser images
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Fallback for any external images
    dangerouslyAllowSVG: false,
  },
  // Use a different output format to avoid symlink issues on Windows
  // output: 'standalone',
  webpack: (config, { isServer }) => {
    // Optimize for large files
    config.optimization.moduleIds = 'deterministic';
    
    // Increase memory limit for webpack
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    };
    
    return config;
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
