/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Prevent Remotion server-side packages from bundling into client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        child_process: false,
        os: false,
      };
    }
    return config;
  },
  // Keep heavy Node.js packages server-side only
  experimental: {
    serverComponentsExternalPackages: [
      "@remotion/renderer",
      "@remotion/bundler",
      "@remotion/cli",
      "esbuild",
      "@rspack/core",
      "@rspack/binding",
      "@rspack/binding-win32-x64-msvc",
    ],
  },
};

export default nextConfig;
