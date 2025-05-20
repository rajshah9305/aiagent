/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sambanova.ai',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SAMBANOVA_API_KEY: process.env.NEXT_PUBLIC_SAMBANOVA_API_KEY,
    SAMBANOVA_API_URL: process.env.SAMBANOVA_API_URL,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // For Docker deployment
  output: 'standalone',
};

module.exports = nextConfig;
