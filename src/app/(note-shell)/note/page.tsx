import { getSeniorId, isAuthenticated } from '@/lib/auth/session';
import { redirect, unauthorized } from 'next/navigation';
import { Suspense } from 'react';
import { NoteListSection } from './_components/note-list-section';
import { NoteListSkeleton } from './_components/skeletons';

export default async function NotePage() {
  // proxy.ts에서도 막지만, 약물노트는 사용자 데이터를 직접 조회하므로 세션 유효성을 한 번 더 확인
  if (!(await isAuthenticated())) {
    unauthorized();
  }

  // 부모님 등록이 끝나야 seniorId가 세션에 존재함(GET /api/seniors가 없어 등록 시점에만 저장)
  const seniorId = await getSeniorId();
  if (!seniorId) {
    redirect('/onboarding/step1');
  }

  return (
    <>
      <h1 className="sr-only">약물노트</h1>
      <Suspense fallback={<NoteListSkeleton />}>
        <NoteListSection seniorId={seniorId} />
      </Suspense>
    </>
  );
}
