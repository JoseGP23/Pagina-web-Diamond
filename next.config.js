/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Genera .next/standalone: un servidor Node mínimo con solo las
  // dependencias que usa en producción — es lo que se copia al contenedor
  // Docker para que la imagen sea liviana.
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

module.exports = nextConfig;
