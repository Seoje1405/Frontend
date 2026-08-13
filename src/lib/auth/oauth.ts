export type OAuthProvider = 'kakao' | 'naver';

const OAUTH_PROVIDERS: readonly OAuthProvider[] = ['kakao', 'naver'];

export function isOAuthProvider(value: string): value is OAuthProvider {
  return (OAUTH_PROVIDERS as readonly string[]).includes(value);
}

interface OAuthConfig {
  authorizeUrl: string;
  clientId: string;
  redirectUri: string;
}

function getOAuthConfig(provider: OAuthProvider): OAuthConfig {
  if (provider === 'kakao') {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      throw new Error('카카오 OAuth 환경 변수가 설정되지 않았습니다.');
    }
    return { authorizeUrl: 'https://kauth.kakao.com/oauth/authorize', clientId, redirectUri };
  }

  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    throw new Error('네이버 OAuth 환경 변수가 설정되지 않았습니다.');
  }
  return { authorizeUrl: 'https://nid.naver.com/oauth2.0/authorize', clientId, redirectUri };
}

export function buildAuthorizeUrl(provider: OAuthProvider, state: string): string {
  const { authorizeUrl, clientId, redirectUri } = getOAuthConfig(provider);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  });
  return `${authorizeUrl}?${params.toString()}`;
}
