import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.zurizanzibar.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chapelstack-bucket.s3.eu-west-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['images.unsplash.com', 'unsplash.com', 'via.placeholder.com', 'picsum.photos', 'www.zurizanzibar.com', 'chapelstack-bucket.s3.eu-west-1.amazonaws.com']
  }
};

export default nextConfig;
