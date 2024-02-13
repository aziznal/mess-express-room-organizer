/** @type {import('next').NextConfig} */
let nextConfig = {};

if (process.env.NODE_ENV === "development") {
  // no need to do anything here
} else {
  nextConfig = {
    ...nextConfig,
    experimental: {
      outputFileTracingExcludes: {
        "*": ["node_modules/canvas/**"],
      },
    },
    webpack: (config) => {
      config.externals = [...config.externals, "canvas", "jsdom"];
      return config;
    },
  };
}

export default nextConfig;
