import Image from 'next/image';
import { AppLogo } from './_components/app-logo';

// /auth/callback/[provider]에서 로그인 실패 시 붙이는 error 쿼리 값별 안내 문구
const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  oauth_denied: '로그인이 취소되었습니다.',
  invalid_state: '로그인 세션이 만료되었습니다. 다시 시도해주세요.',
  login_failed: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
};

type SearchParams = Promise<{ error?: string }>;

export default async function OnboardingPage({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  const errorMessage = error
    ? (LOGIN_ERROR_MESSAGES[error] ?? LOGIN_ERROR_MESSAGES.login_failed)
    : null;

  return (
    <div
      className="ob-bg flex flex-1 flex-col px-5.5"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 5rem)' }}
    >
      <span className="text-brand-link block text-center text-2xl font-bold">온길</span>

      <AppLogo />

      <h1 className="kr-wrap text-ink-900 mx-4 mt-10 text-center text-4xl font-bold">
        보호자가 대신 관리하는
        <br />
        복약 케어
      </h1>
      <p className="kr-wrap text-ink-700 mx-6 mt-3.5 text-center text-sm leading-[1.7]">
        부모님은 전화만 받으세요.
        <br />
        복약 관리는 보호자가 도와드립니다.
      </p>

      <div className="flex-1" />

      {errorMessage && (
        <p
          role="alert"
          className="kr-wrap bg-danger-bg text-danger mx-4 mb-4 rounded-md px-4 py-3 text-center text-sm"
        >
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-2.5 pb-2">
        {/* OAuth 인가 서버로 나가는 리다이렉트라 next/link 소프트 내비게이션 대신 일반 앵커로 전체 페이지 이동시킴 */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/auth/kakao"
          className="bg-social-kakao text-social-kakao-text focus-visible:ring-primary relative grid h-14 place-items-center rounded-2xl text-base font-bold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:opacity-80"
        >
          <span className="absolute left-4">
            <Image src="/assets/icons/kakao.svg" alt="" width={20} height={20} />
          </span>
          카카오로 로그인
        </a>

        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/auth/naver"
          className="bg-social-naver text-social-naver-text focus-visible:ring-primary relative grid h-14 place-items-center rounded-2xl text-base font-bold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:opacity-80"
        >
          <span className="absolute left-4">
            <Image src="/assets/icons/naver.svg" alt="" width={20} height={20} />
          </span>
          네이버로 로그인
        </a>
      </div>

      <p className="kr-wrap text-ink-500 mt-4.5 mb-7 text-center text-xs">
        로그인 후 부모님 정보를 등록할 수 있습니다.
      </p>
    </div>
  );
}
