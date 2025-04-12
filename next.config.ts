import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "toy-erp.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "192.168.0.153",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
