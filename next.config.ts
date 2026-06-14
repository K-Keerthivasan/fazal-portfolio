import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // REQUIRED for react-pdf / pdfjs-dist. pdf.js lists `canvas` as an optional
  // Node-only dependency. In the browser it must be stubbed out, otherwise
  // webpack injects a broken module and the PDF viewer crashes at runtime with
  // "Object.defineProperty called on non-object". Do not remove this.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
