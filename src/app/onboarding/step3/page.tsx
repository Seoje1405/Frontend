import { StepHeader } from '../components/StepHeader';
import { MealTimeForm } from './components/MealTimeForm';

export default function Step3Page() {
  return (
    <main className="ob-bg bg-surface-2 mx-auto flex min-h-svh w-full max-w-[390px] flex-col">
      <div className="flex flex-1 flex-col">
        <StepHeader step={3} total={3} back="/onboarding/step2" />

        <div className="px-5.5 pt-5.5 pb-0">
          <h1 className="text-ink-900 mb-1.5 text-4xl font-bold">
            부모님의 식사 시간을
            <br />
            알려주세요
          </h1>
          <p className="kr-wrap text-ink-700 text-sm">
            입력한 시간을 기준으로 복약 알림이 제공됩니다.
          </p>
        </div>

        <MealTimeForm />
      </div>
    </main>
  );
}
