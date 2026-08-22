import { getSeniorId, isAuthenticated } from '@/lib/auth/session';
import { redirect, unauthorized } from 'next/navigation';
import { Suspense } from 'react';
import { ReportSummarySection } from './_components/report-summary-section';
import { ReportSummarySkeleton } from './_components/skeletons';

export default async function ReportPage() {
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
    <Suspense fallback={<ReportSummarySkeleton />}>
      <ReportSummarySection seniorId={seniorId} />
    </Suspense>
  );
}
