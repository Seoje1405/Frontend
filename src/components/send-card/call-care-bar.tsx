import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface CallCareBarProps {
  back: string;
}

export function CallCareBar({ back }: CallCareBarProps) {
  return (
    <header
      aria-label="연락처 카드 발송 헤더"
      className="border-line bg-surface-2 relative flex items-center border-b px-4.5 pb-3 [view-transition-name:send-card-header]"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
    >
      <Link
        href={back}
        aria-label="이전 단계"
        className="focus-visible:ring-primary hover:bg-secondary -ml-2 grid size-11 place-items-center rounded-full transition-colors duration-150 focus-visible:ring-1 focus-visible:outline-none"
      >
        <ChevronLeft className="text-ink-900 size-5.5" strokeWidth={2.2} aria-hidden="true" />
      </Link>
      <span className="text-brand-link absolute left-1/2 -translate-x-1/2 text-base font-bold">
        CallCare
      </span>
    </header>
  );
}
