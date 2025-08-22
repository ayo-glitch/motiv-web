import path from 'node:path'

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
  webpack: (config, { isServer }) => {
    // Fix for webpack module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ensure '@/' alias resolves to project root in all environments (Linux/macOS/Windows)
    // This mirrors the tsconfig "paths" mapping and prevents case-sensitive FS issues on Vercel
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(process.cwd()),
    };
    
    return config;
  },
  experimental: {
    // Enable React 19 features
    reactCompiler: false,
  },
}

export default nextConfig
