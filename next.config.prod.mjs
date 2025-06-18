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
  // Skip static generation entirely - use server-only mode
  output: 'export',
  distDir: '.next-export',
  // Disable static optimization
  experimental: {
    // No experimental features needed
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
}

export default nextConfig
