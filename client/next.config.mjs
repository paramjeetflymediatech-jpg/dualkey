const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", ""),
        hostname: apiUrl.hostname,
        port: apiUrl.port || undefined,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;