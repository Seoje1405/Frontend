import { getSeniorId, isAuthenticated } from '@/lib/auth/session';
import { getTodayISO } from '@/lib/date';
import { redirect, unauthorized } from 'next/navigation';
import { Suspense } from 'react';
import { ChatFloatingButton } from './_components/chat-floating-button';
import { CurrentCardSection } from './_components/current-card-section';
import { ExpiryAlertSection } from './_components/expiry-alert-section';
import { MediCardSection } from './_components/medi-card-section';
import {
  AlertSkeleton,
  CurrentCardSkeleton,
  MediCardSkeleton,
  WeekStripSkeleton,
} from './_components/skeletons';
import { WeekStripSection } from './_components/week-strip-section';

type SearchParams = Promise<{ date?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { date } = await searchParams;
  const todayISO = getTodayISO();
  const selectedISO = date ?? todayISO;

  // proxy.ts에서도 막지만, 홈 화면은 사용자 데이터를 직접 조회하므로 세션 유효성을 한 번 더 확인
  if (!(await isAuthenticated())) {
    unauthorized();
  }

  // 부모님 등록이 끝나야 seniorId가 세션에 존재함(GET /api/seniors가 없어 등록 시점에만 저장)
  const patientId = await getSeniorId();
  if (!patientId) {
    redirect('/onboarding/step1');
  }

  return (
    <>
      <h1 className="sr-only">홈</h1>
      {/* 챗봇 플로팅 버튼 높이만큼 여백을 둬 마지막 카드가 가려지지 않게 함 */}
      <div className="pb-14">
        <Suspense fallback={<WeekStripSkeleton />}>
          <WeekStripSection anchorISO={todayISO} selectedISO={selectedISO} patientId={patientId} />
        </Suspense>

        <Suspense fallback={<CurrentCardSkeleton />}>
          <CurrentCardSection patientId={patientId} date={selectedISO} />
        </Suspense>

        <Suspense fallback={<AlertSkeleton />}>
          <ExpiryAlertSection patientId={patientId} />
        </Suspense>

        <Suspense fallback={<MediCardSkeleton />}>
          <MediCardSection patientId={patientId} date={selectedISO} />
        </Suspense>
      </div>

      <ChatFloatingButton />
    </>
  );
}
