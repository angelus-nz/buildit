import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "bcryptjs"],
  turbopack: {
    resolveAlias: {
      // pg uses `util/types` which is a Node.js subpath export; polyfill for Turbopack
      "util/types": "util",
    },
  },
};

export default nextConfig;
