/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Esto permite cualquier dominio
      },
    ],
  },
};

export default nextConfig;