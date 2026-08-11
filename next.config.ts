import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/web-quiz",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;


