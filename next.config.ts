import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // pdf.js (used by react-pdf) lists `canvas` as an optional Node-only dependency.
    // It is not needed in the browser, so stub it out to avoid build warnings/errors.
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
