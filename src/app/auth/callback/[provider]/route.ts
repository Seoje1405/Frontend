import { ApiError, apiClient } from '@/lib/api/client';
import { OAUTH_STATE_COOKIE } from '@/lib/auth/constants';
import { isOAuthProvider } from '@/lib/auth/oauth';
import { setAccessToken } from '@/lib/auth/session';
import type { AuthResponse } from '@/types/api';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

function loginFailedUrl(request: NextRequest, reason: string): URL {
  const url = new URL('/onboarding', request.url);
  url.searchParams.set('error', reason);
  return url;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  if (!isOAuthProvider(provider)) {
    return new NextResponse(null, { status: 404 });
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);

  const { searchParams } = request.nextUrl;
  const errorParam = searchParams.get('error');
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // 사용자가 동의 화면에서 취소한 경우
  if (errorParam) {
    return NextResponse.redirect(loginFailedUrl(request, 'oauth_denied'));
  }

  // state 불일치는 CSRF 공격 정황이므로 로그인 실패로 처리
  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(loginFailedUrl(request, 'invalid_state'));
  }

  try {
    const query = new URLSearchParams({ code });
    // 네이버만 state를 백엔드 인가코드 검증에 사용 (카카오 스펙에는 없음)
    if (provider === 'naver') {
      query.set('state', state);
    }

    const auth = await apiClient.post<AuthResponse>(
      `/api/auth/oauth/${provider}?${query.toString()}`,
      undefined,
      { skipAuth: true },
    );

    await setAccessToken(auth.accessToken, auth.expiresIn);

    const destination = auth.isNewUser ? '/onboarding/step1' : '/home';
    return NextResponse.redirect(new URL(destination, request.url));
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('[auth-callback]', provider, error.status, error.message);
    } else {
      console.error('[auth-callback]', provider, error);
    }
    return NextResponse.redirect(loginFailedUrl(request, 'login_failed'));
  }
}
