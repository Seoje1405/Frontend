import { OAUTH_STATE_COOKIE } from '@/lib/auth/constants';
import { buildAuthorizeUrl, isOAuthProvider } from '@/lib/auth/oauth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// state 쿠키는 콜백에서 검증 후 즉시 삭제되므로 짧게 유지
const OAUTH_STATE_MAX_AGE_SECONDS = 60 * 10;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  if (!isOAuthProvider(provider)) {
    return new NextResponse(null, { status: 404 });
  }

  // 네이버는 백엔드 Notion 스펙 요청으로 고정 state "abc999" 사용 (정식 CSRF state 발급 방식 확정 전까지 임시)
  // const state = crypto.randomUUID();
  const state = provider === 'naver' ? 'abc999' : crypto.randomUUID();
  (await cookies()).set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OAUTH_STATE_MAX_AGE_SECONDS,
  });

  return NextResponse.redirect(buildAuthorizeUrl(provider, state));
}
