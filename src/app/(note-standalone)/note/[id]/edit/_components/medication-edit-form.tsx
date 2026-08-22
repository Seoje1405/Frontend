'use client';

import {
  applyCardChange,
  createCard,
} from '@/app/(medication-standalone)/medication-add/direct/_components/card-factory';
import {
  getAutoDosingTimes,
  normalizeFrequency,
  toTotalDays,
} from '@/app/(medication-standalone)/medication-add/direct/_components/dosing';
import { HospitalSearchInput } from '@/app/(medication-standalone)/medication-add/direct/_components/hospital-search-input';
import { MedicationFormCard } from '@/app/(medication-standalone)/medication-add/direct/_components/medication-form-card';
import type { MedicationCard } from '@/app/(medication-standalone)/medication-add/direct/_components/types';
import { Button } from '@/components/ui/button';
import { updateMedication } from '@/lib/actions/medication';
import type { MedicationEditInitialValues } from '@/lib/data/types';
import type { MedicationUpdateInput } from '@/lib/schema/medication';
import dayjs from 'dayjs';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface MedicationEditFormProps {
  medicationId: number;
  initialValues: MedicationEditInitialValues;
}

function toInitialCard(initialValues: MedicationEditInitialValues): MedicationCard {
  const frequency = normalizeFrequency(initialValues.timesPerDay);
  return createCard({
    nickname: initialValues.drugNickname ?? '',
    medicationName: initialValues.drugName,
    dosagePerOnce: initialValues.dosagePerTime ?? '',
    frequency,
    dosingTimes: getAutoDosingTimes(frequency),
    memo: initialValues.memo ?? '',
    startDate: initialValues.startDate ? dayjs(initialValues.startDate).toDate() : null,
    endDate: initialValues.endDate ? dayjs(initialValues.endDate).toDate() : null,
  });
}

export function MedicationEditForm({ medicationId, initialValues }: MedicationEditFormProps) {
  const router = useRouter();
  const [card, setCard] = useState<MedicationCard>(() => toInitialCard(initialValues));
  const [hospitalName, setHospitalName] = useState(initialValues.hospitalName ?? '');
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!card.medicationName.trim()) {
      toast.error('약 이름을 입력해주세요.');
      return;
    }
    if (!card.startDate) {
      toast.error('복용 시작일을 선택해주세요.');
      return;
    }

    const payload: MedicationUpdateInput = {
      nickname: card.nickname,
      medicationName: card.medicationName,
      dosagePerOnce: card.dosagePerOnce,
      dosingTimesCount: card.frequency,
      memo: card.memo,
      startDate: dayjs(card.startDate).format('YYYY-MM-DD'),
      totalDays: toTotalDays(card.startDate, card.endDate),
      hospitalName,
    };

    startTransition(async () => {
      const result = await updateMedication(medicationId, payload);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success('약물 정보가 수정되었어요!');
      router.push('/note');
    });
  }

  return (
    <div className="bg-surface flex min-h-dvh flex-col">
      {/* TopAppBar */}
      <header className="z-sticky border-border bg-surface-2 sticky top-0 border-b px-2 pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="뒤로 가기"
            className="text-primary focus-visible:ring-primary -m-2.5 p-2.5 focus-visible:rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
          <h1 className="text-foreground text-xl font-semibold">약 정보 수정</h1>
        </div>
      </header>

      {/* 스크롤 본문 */}
      <main className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-[max(7rem,calc(env(safe-area-inset-bottom)+7rem))]">
        <MedicationFormCard
          card={card}
          cardIndex={0}
          onChange={(payload) => setCard((prev) => applyCardChange(prev, payload))}
        />

        {/* 처방 정보 */}
        <section className="bg-card shadow-card flex flex-col gap-4 rounded-xl p-4">
          <h2 className="text-foreground text-xl font-semibold">처방 정보</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="hospital-name" className="text-muted-foreground text-xs font-medium">
              처방 병원 <span className="font-normal">(선택)</span>
            </label>
            <HospitalSearchInput value={hospitalName} onChange={setHospitalName} />
          </div>
        </section>
      </main>

      {/* 하단 CTA */}
      <div className="border-border bg-card fixed bottom-0 left-1/2 w-full max-w-[390px] -translate-x-1/2 border-t px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Button size="cta" onClick={handleSubmit} disabled={isPending}>
          {isPending ? '수정 중...' : '수정 완료'}
        </Button>
      </div>
    </div>
  );
}
