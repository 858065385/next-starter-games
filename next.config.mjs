/** @type {import('next').NextConfig} */
import { locales } from "./src/app/config/i18n.js";

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['geist'],
  // 配置静态资源路径
  images: {
    domains: [],
    remotePatterns: [],
  },
  // 提供給客户端的环境变量
  env: {
    NEXT_PUBLIC_SUPPORTED_LOCALES: locales.join(','),
    // 全局时区设置，确保服务器和客户端渲染一致
    NEXT_PUBLIC_TIMEZONE: 'UTC',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
    ];
  },
};

export default nextConfig; 