/** @type {import('next').NextConfig} */
const nextConfig = {
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