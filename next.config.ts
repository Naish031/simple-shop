import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable experimental features for OpenNext
  experimental: {
    // serverComponentsExternalPackages moved to serverExternalPackages in Next.js 15
  },
  // Ensure proper output for SST
  output: "standalone",
  // Disable image optimization for serverless deployment
  images: {
    unoptimized: true,
  },
  // External packages for server components
  serverExternalPackages: ["@aws-sdk/client-s3"],
};

export default nextConfig;
