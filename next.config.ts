import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for Docker builds, but not on Vercel
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
};

export default nextConfig;


