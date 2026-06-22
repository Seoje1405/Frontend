import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface StepHeaderProps {
  step: number;
  total?: number;
  back?: string;
}

export function StepHeader({ step, total = 3, back = '/onboarding/step1' }: StepHeaderProps) {
  return (
    <header className="px-5.5" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.125rem)' }}>
      <div className="flex h-9 items-center justify-between">
        <Link
          href={back}
          aria-label="이전 단계"
          className="focus-visible:ring-primary -ml-2 grid size-11 place-items-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronLeft className="text-ink-900 size-5.5" strokeWidth={2.2} aria-hidden="true" />
        </Link>
        <span
          aria-hidden="true"
          className="text-primary bg-secondary rounded-full px-3.5 py-1.5 text-sm font-bold"
        >
          {step}/{total}단계
        </span>
        <span className="size-11" aria-hidden="true" />
      </div>
      <div
        className="mt-4.5 flex gap-3.5"
        role="progressbar"
        aria-valuemin={0}
        aria-valuenow={step}
        aria-valuemax={total}
        aria-label={`${total}단계 중 ${step}단계`}
      >
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < step ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    </header>
  );
}
