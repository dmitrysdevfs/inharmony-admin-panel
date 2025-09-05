// next.config.mjs

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      ...(process.env.NEXT_PUBLIC_API_BASE_URL
        ? [
            {
              protocol: 'https',
              hostname: new URL(process.env.NEXT_PUBLIC_API_BASE_URL).hostname,
              port: '',
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
