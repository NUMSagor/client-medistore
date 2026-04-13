const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**', // সব external image allow করতে চাইলে
      },
    ],
  },
};

export default nextConfig;