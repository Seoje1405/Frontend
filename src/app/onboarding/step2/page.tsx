import { StepHeader } from '../components/StepHeader';
import { ParentRegisterForm } from './components/ParentRegisterForm';

export default function Step2Page() {
  return (
    <main className="ob-bg bg-surface-2 mx-auto flex min-h-svh w-full max-w-[390px] flex-col">
      <div className="flex flex-1 flex-col">
        <StepHeader step={2} total={3} back="/onboarding/step1" />

        <div className="px-5.5 pt-5.5">
          <h1 className="text-ink-900 mb-1.5 text-4xl font-bold">
            부모님 정보를
            <br />
            입력해주세요
          </h1>
          <p className="kr-wrap text-ink-700 text-sm">
            부모님의 기본 정보와 휴대폰 번호 인증이 필요합니다.
          </p>
        </div>

        <ParentRegisterForm />
      </div>
    </main>
  );
}
