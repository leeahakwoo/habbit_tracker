import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack due to Unicode path handling issues
  // Use SWC for faster builds with better Unicode support
};

export default nextConfig;
