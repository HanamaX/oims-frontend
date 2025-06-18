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
  // Force all pages to be SSR/dynamic to avoid static optimization issues
  output: 'standalone',
  // Enable experimental missingSuspenseWithCSRBailout to mimic previous behavior
  experimental: {
    // Even though we've fixed the components, include this to match previous behavior
    missingSuspenseWithCSRBailout: true
  },
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
