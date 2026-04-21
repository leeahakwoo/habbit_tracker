import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack due to Unicode path handling issues with Korean paths
  // Use SWC compiler instead
};

export default nextConfig;
