// ==================== next.config.js ====================
// 파일 위치: ./next.config.js
// 설명: Next.js 설정 (CloudFlare Pages 최적화)
/** @type {import('next').NextConfig} */

const nextConfig = {
  // CloudFlare Pages 설정
  output: "export",
  trailingSlash: true,

  // 이미지 최적화
  images: {
    unoptimized: true,
    domains: ["drive.google.com", "lh3.googleusercontent.com"],
  },

  // 환경 변수
  env: {
    NEXT_PUBLIC_GAS_URL: process.env.NEXT_PUBLIC_GAS_URL,
    NEXT_PUBLIC_DRIVE_FOLDER_ID: process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },

  // 프로덕션 최적화
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // 실험적 기능
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },

  // 보안 헤더
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
