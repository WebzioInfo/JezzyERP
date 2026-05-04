import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048, 3840],
  },
  serverExternalPackages: ["@prisma/client", "pdf-parse", "tesseract.js"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@headlessui/react", "@heroicons/react"],
  },
};

export default nextConfig;
