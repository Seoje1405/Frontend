import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    authInterrupts: true,
  },
  outputFileTracingIncludes: {
    '/api/report/pdf': ['./node_modules/pretendard/dist/public/static/alternative/**/*'],
  },
};

export default nextConfig;
