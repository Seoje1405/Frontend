import { getSeniorId, isAuthenticated } from '@/lib/auth/session';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect, unauthorized } from 'next/navigation';
import { Suspense } from 'react';
import { ReportMedicationsHeaderCount } from './_components/report-medications-header-count';
import { ReportMedicationsList } from './_components/report-medications-list';
import {
  ReportMedicationsHeaderCountSkeleton,
  ReportMedicationsListSkeleton,
} from './_components/skeletons';

export default async function ReportMedicationsPage() {
  // proxy.ts에서도 막지만, 리포트는 사용자 데이터를 직접 조회하므로 세션 유효성을 한 번 더 확인
  if (!(await isAuthenticated())) {
    unauthorized();
  }

  // 부모님 등록이 끝나야 seniorId가 세션에 존재함(GET /api/seniors가 없어 등록 시점에만 저장)
  const seniorId = await getSeniorId();
  if (!seniorId) {
    redirect('/onboarding/step1');
  }

  return (
    <div className="bg-surface mx-auto flex min-h-dvh max-w-[390px] flex-col">
      <header className="z-sticky border-line bg-surface-2 sticky top-0 border-b px-2 pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center gap-3">
          <Link
            href="/report"
            aria-label="뒤로 가기"
            className="text-ink-700 focus-visible:ring-primary -ml-1 flex min-h-11 min-w-11 items-center justify-center rounded-md focus-visible:ring-1 focus-visible:outline-none"
          >
            <ChevronLeft size={22} aria-hidden />
          </Link>
          <Suspense fallback={<ReportMedicationsHeaderCountSkeleton />}>
            <ReportMedicationsHeaderCount seniorId={seniorId} />
          </Suspense>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-3 p-4">
        <Suspense fallback={<ReportMedicationsListSkeleton />}>
          <ReportMedicationsList seniorId={seniorId} />
        </Suspense>
      </main>
    </div>
  );
}
