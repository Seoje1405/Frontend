import { ACCESS_TOKEN_COOKIE } from '@/lib/auth/constants';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 정확히 일치할 때만 공개 — 온보딩 랜딩(로그인 버튼)만 비로그인으로 접근 가능,
// step1~3(부모님 등록 마법사)는 로그인 필요 (Phase 1: OAuth 연결로 재검토됨)
const EXACT_PUBLIC_PATHS = ['/', '/onboarding', '/unauthorized'];

// 하위 경로까지 공개 — OAuth 인가/콜백 라우트, API 라우트 핸들러(각자 자체적으로 세션/입력 검증 후 401 JSON 반환)
const PREFIX_PUBLIC_PATHS = ['/auth', '/api'];

function isPublicPath(pathname: string): boolean {
  return (
    EXACT_PUBLIC_PATHS.includes(pathname) ||
    PREFIX_PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|fonts).*)'],
};
