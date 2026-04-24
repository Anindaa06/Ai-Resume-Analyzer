/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.externals = [
      ...(config.externals || []),
      { "pdf-parse": "commonjs pdf-parse" },
    ];
    return config;
  },
};

export default nextConfig;