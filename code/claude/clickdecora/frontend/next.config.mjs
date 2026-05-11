/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
    ],
  },
  serverRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL,
    mpAccessToken: process.env.MP_ACCESS_TOKEN,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  },
  publicRuntimeConfig: {
    calendlyUrl: process.env.CALENDLY_URL,
  },
};

export default nextConfig;
