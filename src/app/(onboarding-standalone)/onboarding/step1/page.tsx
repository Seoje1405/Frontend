import { StepHeader } from '@/components/parent-form/step-header';
import { ParentRegisterForm } from './_components/parent-register-form';

export default function Step1Page() {
  return (
    <div className="ob-bg flex flex-1 flex-col">
      <StepHeader step={1} total={2} back="/onboarding" />

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
  );
}
