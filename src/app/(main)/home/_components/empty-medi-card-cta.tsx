'use client';

import { Button } from '@/components/ui/button';
import { useMedicationSheetStore } from '@/lib/stores/medication-sheet-store';

// "/register"는 존재하지 않는 라우트 — 하단 네비 등록 버튼과 동일하게 약 등록 시트를 직접 오픈
export function EmptyMediCardCta() {
  const openSheet = useMedicationSheetStore((s) => s.open);

  return (
    <Button
      type="button"
      onClick={openSheet}
      className="shadow-fab h-14 rounded-2xl px-10 font-bold"
    >
      약 등록하기
    </Button>
  );
}
