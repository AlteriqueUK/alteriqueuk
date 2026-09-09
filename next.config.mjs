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
      // Journal pictures uploaded from /admin. They come back either from the
      // bucket's public r2.dev domain or, when the bucket has none, as a
      // presigned link straight off the R2 S3 endpoint.
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      // A custom domain on the R2 bucket, when one is set up
      ...(process.env.NEXT_PUBLIC_IMAGE_HOSTNAME
        ? [
            {
              protocol: "https",
              hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
