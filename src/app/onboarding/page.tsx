import Image from 'next/image';
import Link from 'next/link';
import { AppLogo } from './components/AppLogo';

export default function OnboardingPage() {
  return (
    <main
      className="ob-bg bg-surface-2 mx-auto flex min-h-svh w-full max-w-[390px] flex-col"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 5rem)' }}
    >
      <div className="flex flex-1 flex-col px-5.5">
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

        <div className="flex flex-col gap-2.5 pb-2">
          <Link
            href="/onboarding/step1"
            className="bg-social-kakao text-social-kakao-text focus-visible:ring-primary relative grid h-14 place-items-center rounded-2xl text-base font-bold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:opacity-80"
          >
            <span className="absolute left-4">
              <Image src="/assets/icons/kakao.svg" alt="" width={20} height={20} />
            </span>
            카카오로 로그인
          </Link>

          <Link
            href="/onboarding/step1"
            className="bg-social-naver text-social-naver-text focus-visible:ring-primary relative grid h-14 place-items-center rounded-2xl text-base font-bold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:opacity-80"
          >
            <span className="absolute left-4">
              <Image src="/assets/icons/naver.svg" alt="" width={20} height={20} />
            </span>
            네이버로 로그인
          </Link>
        </div>

        <p className="kr-wrap text-ink-500 mt-4.5 mb-7 text-center text-xs">
          로그인 후 부모님 정보를 등록할 수 있습니다.
        </p>
      </div>
    </main>
  );
}
