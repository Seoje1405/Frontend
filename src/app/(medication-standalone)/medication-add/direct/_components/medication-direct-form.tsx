'use client';

import { Button } from '@/components/ui/button';
import { registerMedications } from '@/lib/actions/medication';
import type { MedicationRegisterInput } from '@/lib/schema/medication';
import { useOcrResultStore } from '@/lib/stores/ocr-result-store';
import dayjs from 'dayjs';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useReducer, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { AddCardButton } from './add-card-button';
import { HospitalSearchInput } from './hospital-search-input';
import { MedicationFormCard } from './medication-form-card';
import type { CardAction, DosingTime, MedicationCard } from './types';

function createCard(override: Partial<MedicationCard> = {}): MedicationCard {
  return {
    id: crypto.randomUUID(),
    nickname: '',
    medicationName: '',
    frequency: null,
    dosagePerOnce: '',
    dosingTimes: [],
    memo: '',
    autoMemo: '',
    startDate: null,
    endDate: null,
    ...override,
  };
}

function getAutoDosingTimes(frequency: 1 | 2 | 3 | null): DosingTime[] {
  switch (frequency) {
    case 1:
      return ['noon'];
    case 2:
      return ['morning', 'noon'];
    case 3:
      return ['morning', 'noon', 'night'];
    default:
      return [];
  }
}

// OCR이 인식한 하루 복용 횟수를 폼이 다루는 1~3 범위로 정규화(범위 밖이면 미지정 처리)
function normalizeFrequency(timesPerDay: number | null): 1 | 2 | 3 | null {
  return timesPerDay !== null && timesPerDay >= 1 && timesPerDay <= 3
    ? (timesPerDay as 1 | 2 | 3)
    : null;
}

function reducer(state: MedicationCard[], action: CardAction): MedicationCard[] {
  switch (action.type) {
    case 'ADD_CARD':
      return [...state, createCard()];
    case 'ADD_CARD_WITH_DRUG': {
      // 아무것도 입력되지 않은 빈 카드를 제거 후 새 카드 추가
      const withoutEmpty = state.filter(
        (c) => c.medicationName.trim() !== '' || c.nickname.trim() !== '',
      );
      return [
        ...withoutEmpty,
        createCard({
          medicationName: action.payload.medicationName,
          autoMemo: action.payload.autoMemo ?? '',
        }),
      ];
    }
    case 'ADD_CARDS_FROM_OCR':
      return action.payload;
    case 'REMOVE_CARD': {
      const filtered = state.filter((c) => c.id !== action.id);
      return filtered.length > 0 ? filtered : [createCard()];
    }
    case 'UPDATE_CARD':
      return state.map((card) => {
        if (card.id !== action.id) return card;
        const updated = { ...card, ...action.payload };
        if ('frequency' in action.payload) {
          // 횟수 변경 → 시기 자동 설정
          updated.dosingTimes = getAutoDosingTimes(updated.frequency);
        } else if ('dosingTimes' in action.payload) {
          // 시기 변경 → 횟수를 선택 수에 맞게 자동 반영
          const count = updated.dosingTimes.length;
          updated.frequency = count >= 1 && count <= 3 ? (count as 1 | 2 | 3) : null;
        }
        return updated;
      });
  }
}

// 복용 시작~종료일을 백엔드가 받는 총 복용일수로 변환(당일 포함 계산)
function toTotalDays(start: Date | null, end: Date | null): number | null {
  if (!start || !end) return null;
  const diff = dayjs(end).diff(dayjs(start), 'day') + 1;
  return diff > 0 ? diff : null;
}

function validateCards(cards: MedicationCard[]): string | null {
  for (const card of cards) {
    if (!card.medicationName.trim()) return '약 이름을 입력해주세요.';
    if (!card.startDate) return '복용 시작일을 선택해주세요.';
  }
  return null;
}

export function MedicationDirectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cards, dispatch] = useReducer(reducer, null, () => [createCard()]);
  const [hospitalName, setHospitalName] = useState('');
  const [ocrMeta, setOcrMeta] = useState<{
    ocrResultId: number | null;
    prescriptionDate: string | null;
  }>({ ocrResultId: null, prescriptionDate: null });
  const [isPending, startTransition] = useTransition();
  const processedTsRef = useRef<string | null>(null);
  const ocrConsumedRef = useRef(false);
  const drugName = searchParams.get('drugName');
  const autoMemo = searchParams.get('autoMemo');
  const ts = searchParams.get('ts');
  const ocrResult = useOcrResultStore((s) => s.result);
  const clearOcrResult = useOcrResultStore((s) => s.clear);

  // 검색 결과 복귀 시 새 카드 자동 추가 (ts로 중복 dispatch 방지)
  useEffect(() => {
    if (!drugName || !ts || ts === processedTsRef.current) return;
    processedTsRef.current = ts;
    dispatch({
      type: 'ADD_CARD_WITH_DRUG',
      payload: {
        medicationName: decodeURIComponent(drugName),
        autoMemo: autoMemo ? decodeURIComponent(autoMemo) : undefined,
      },
    });
  }, [drugName, autoMemo, ts]);

  // OCR 스캔 결과 도착 시 파싱된 약들로 카드 배열을 교체 (1회만 반영)
  useEffect(() => {
    if (!ocrResult || ocrConsumedRef.current) return;
    ocrConsumedRef.current = true;

    const parsedCards = ocrResult.parsedDrugs.map((drug) => {
      const frequency = normalizeFrequency(drug.timesPerDay);
      return createCard({
        medicationName: drug.drugName ?? '',
        dosagePerOnce: drug.dosagePerTime ?? '',
        frequency,
        dosingTimes: getAutoDosingTimes(frequency),
      });
    });

    if (parsedCards.length > 0) {
      dispatch({ type: 'ADD_CARDS_FROM_OCR', payload: parsedCards });
    }
    setOcrMeta({
      ocrResultId: ocrResult.ocrResultId,
      prescriptionDate: ocrResult.prescriptionDate,
    });
    clearOcrResult();
  }, [ocrResult, clearOcrResult]);

  function handleSubmit() {
    const validationError = validateCards(cards);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload: MedicationRegisterInput = {
      hospitalName,
      ocrResultId: ocrMeta.ocrResultId,
      prescriptionDate: ocrMeta.prescriptionDate,
      cards: cards.map((card) => ({
        nickname: card.nickname,
        medicationName: card.medicationName,
        dosagePerOnce: card.dosagePerOnce,
        dosingTimesCount: card.frequency,
        memo: card.memo,
        startDate: dayjs(card.startDate).format('YYYY-MM-DD'),
        totalDays: toTotalDays(card.startDate, card.endDate),
      })),
    };

    startTransition(async () => {
      const result = await registerMedications(payload);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success('약물이 등록 되었어요!');
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
          <h1 className="text-foreground text-xl font-semibold">약 등록하기</h1>
        </div>
      </header>

      {/* 스크롤 본문 */}
      <main className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-[max(7rem,calc(env(safe-area-inset-bottom)+7rem))]">
        {cards.map((card, index) => (
          <MedicationFormCard
            key={card.id}
            card={card}
            cardIndex={index}
            onChange={(payload) => dispatch({ type: 'UPDATE_CARD', id: card.id, payload })}
            onDelete={() => dispatch({ type: 'REMOVE_CARD', id: card.id })}
          />
        ))}

        <AddCardButton onClick={() => router.push('/medication-add/search')} />

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
          {isPending ? '등록 중...' : '등록하기'}
        </Button>
      </div>
    </div>
  );
}
