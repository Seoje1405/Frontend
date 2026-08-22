'use client';

import { cn } from '@/lib/utils';
import { Camera, Info, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { DateRangePicker } from './date-range-picker';
import { DosingTimeToggle } from './dosing-time-toggle';
import { FrequencySelect } from './frequency-select';
import type { MedicationCard } from './types';

interface MedicationFormCardProps {
  card: MedicationCard;
  cardIndex: number;
  onChange: (payload: Partial<MedicationCard>) => void;
  onDelete?: () => void;
}

const INPUT_CLASS =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-ink-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none';

export function MedicationFormCard({
  card,
  cardIndex,
  onChange,
  onDelete,
}: MedicationFormCardProps) {
  const uid = useId();
  const router = useRouter();

  return (
    <article
      className="bg-card shadow-card flex flex-col overflow-hidden rounded-xl"
      aria-label={`약 ${cardIndex + 1}: ${card.medicationName || '이름 없음'}`}
    >
      {/* 사진 + 별명 + 약이름 + X */}
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          aria-label="약 사진 추가"
          className="border-border text-muted-foreground hover:border-primary hover:text-primary flex size-14 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors"
        >
          <Camera size={18} aria-hidden />
          <span className="text-2xs">사진</span>
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            id={`${uid}-nickname`}
            type="text"
            placeholder="별명 (예: 혈압약)"
            value={card.nickname}
            onChange={(e) => onChange({ nickname: e.target.value })}
            className={INPUT_CLASS}
            aria-label="약 별명"
          />
          <div className="relative flex items-center">
            <input
              id={`${uid}-name`}
              type="text"
              placeholder="약 이름을 입력하거나 검색하세요"
              value={card.medicationName}
              onChange={(e) => onChange({ medicationName: e.target.value })}
              className={cn(INPUT_CLASS, 'pr-9')}
              aria-label="약 이름"
            />
            <button
              type="button"
              onClick={() => router.push(`/medication-add/search?cardId=${card.id}`)}
              aria-label="약물 검색"
              className="text-muted-foreground hover:text-primary focus-visible:ring-primary absolute right-2.5 -m-2.5 p-2.5 transition-colors focus-visible:rounded-md focus-visible:ring-1 focus-visible:outline-none"
            >
              <Search size={16} aria-hidden />
            </button>
          </div>
        </div>

        {onDelete && (
          <button
            type="button"
            aria-label="약 카드 삭제"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive focus-visible:ring-primary -mt-3 -mr-3 p-3 transition-colors focus-visible:rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <X size={18} aria-hidden />
          </button>
        )}
      </div>

      <div className="bg-border h-px" />

      {/* 복용 횟수 + 1회 용량 */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">복용 횟수</span>
          <FrequencySelect
            value={card.frequency}
            onChange={(freq) => onChange({ frequency: freq })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-dosage`} className="text-muted-foreground text-xs font-medium">
            1회 용량
          </label>
          <input
            id={`${uid}-dosage`}
            type="text"
            placeholder="예: 1정"
            value={card.dosagePerOnce}
            onChange={(e) => onChange({ dosagePerOnce: e.target.value })}
            className={cn(INPUT_CLASS, 'h-9 py-0')}
          />
        </div>
      </div>

      <div className="bg-border h-px" />

      {/* 복용 시기 */}
      <div className="flex flex-col gap-2 p-4">
        <span className="text-muted-foreground text-xs font-medium">복용 시기</span>
        <DosingTimeToggle
          selected={card.dosingTimes}
          onChange={(times) => onChange({ dosingTimes: times })}
        />
      </div>

      <div className="bg-border h-px" />

      {/* 메모 */}
      <div className="flex flex-col gap-2 p-4">
        <span className="text-muted-foreground text-xs font-medium">메모</span>
        {card.autoMemo ? (
          <div className="bg-accent flex items-start gap-2 rounded-lg px-3 py-2.5">
            <Info size={14} className="text-primary mt-0.5 shrink-0" aria-hidden />
            <p className="kr-wrap text-accent-foreground text-sm">{card.autoMemo}</p>
          </div>
        ) : null}
        <textarea
          placeholder="추가 메모를 입력해 주세요"
          value={card.memo}
          onChange={(e) => onChange({ memo: e.target.value })}
          rows={2}
          className={cn(INPUT_CLASS, 'kr-wrap resize-none')}
          aria-label="메모"
        />
      </div>

      <div className="bg-border h-px" />

      {/* 복용 기간 */}
      <div className="flex flex-col gap-2 p-4">
        <span className="text-muted-foreground text-xs font-medium">복용 기간</span>
        <DateRangePicker
          startDate={card.startDate}
          endDate={card.endDate}
          onStartChange={(date) => onChange({ startDate: date })}
          onEndChange={(date) => onChange({ endDate: date })}
        />
      </div>
    </article>
  );
}
