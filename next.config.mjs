/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Temporary Unsplash imagery until the client's photography arrives.
    // Safe to remove this entry once all images live in /public/images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
