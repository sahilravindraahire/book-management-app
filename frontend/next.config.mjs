/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://book-management-backend-9jmz.onrender.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;