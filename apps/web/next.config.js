/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://localhost:4000/graphql',
      },
    ]
  },
};

module.exports = nextConfig;
