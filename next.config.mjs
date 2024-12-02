/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
       
      },
    ],
  },
  swcMinify: true
};

export default nextConfig;
