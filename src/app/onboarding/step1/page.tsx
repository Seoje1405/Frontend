import { StepHeader } from '../components/StepHeader';
import { PhoneVerifyForm } from './components/PhoneVerifyForm';

export default function Step1Page() {
  return (
    <main className="ob-bg bg-surface-2 mx-auto flex min-h-svh w-full max-w-[390px] flex-col">
      <div className="flex flex-1 flex-col">
        <StepHeader step={1} total={3} back="/onboarding" />

        <div className="px-5.5 pt-5.5">
          <h1 className="text-ink-900 mb-1.5 text-4xl font-bold">
            휴대폰 번호를
            <br />
            인증해 주세요
          </h1>
          <p className="kr-wrap text-ink-700 text-sm">
            정확한 서비스 이용을 위해 보호자님의 휴대폰 번호 인증이 필요합니다.
          </p>
        </div>

        <PhoneVerifyForm />
      </div>
    </main>
  );
}
