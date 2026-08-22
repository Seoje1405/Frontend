'use client';

import { checkMedication } from '@/lib/actions/medication';
import type { MedColor, Medication } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { CircleCheck, Pill } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';
import { toast } from 'sonner';

const MED_COLOR: Record<MedColor, { bg: string; text: string }> = {
  blue: { bg: 'bg-med-blue-bg', text: 'text-med-blue' },
  purple: { bg: 'bg-med-purple-bg', text: 'text-med-purple' },
  orange: { bg: 'bg-med-orange-bg', text: 'text-med-orange' },
};

interface MediCardItemProps {
  med: Medication;
}

export function MediCardItem({ med }: MediCardItemProps) {
  const [isPending, startTransition] = useTransition();
  const [localChecked, setLocalChecked] = useState(med.checked);
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(
    localChecked,
    (_current, next: boolean) => next,
  );
  const colorCls = MED_COLOR[med.color];

  const handleToggle = () => {
    const next = !optimisticChecked;
    startTransition(async () => {
      setOptimisticChecked(next);
      const result = await checkMedication(med.id, med.mealTime);
      if (result.ok) {
        // 백엔드가 "반전"만 지원하므로 클라이언트가 예측한 값이 아니라 서버 응답을 최종 상태로 신뢰
        setLocalChecked(result.isTaken);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <li
      className={cn(
        'flex items-start gap-3 px-4 py-3.5 transition-colors duration-150',
        optimisticChecked && 'bg-status-active-bg',
      )}
    >
      <div
        aria-hidden="true"
        className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', colorCls.bg)}
      >
        <Pill strokeWidth={1.9} className={cn('h-5 w-5', colorCls.text)} />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <span
          className={cn(
            'text-foreground text-base font-semibold transition-colors duration-150',
            optimisticChecked && 'text-muted-foreground line-through',
          )}
        >
          {med.name}
        </span>
        {med.kind && (
          <span
            className={cn(
              'text-muted-foreground text-sm transition-colors duration-150',
              optimisticChecked && 'line-through',
            )}
          >
            {med.kind}
          </span>
        )}
        <div className="flex flex-wrap gap-1.5">
          {med.use.map((u) => (
            <span
              key={u}
              className="border-line text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
            >
              {u}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-pressed={optimisticChecked}
        aria-label={`${med.name} 복용 확인`}
        onClick={handleToggle}
        disabled={isPending || !med.editable}
        className="focus-visible:ring-primary -m-2.5 shrink-0 p-2.5 focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
      >
        <CircleCheck
          aria-hidden="true"
          className={cn(
            'h-6 w-6',
            optimisticChecked
              ? 'fill-primary [&>circle]:stroke-primary [&>path]:stroke-primary-foreground'
              : 'text-primary fill-none',
          )}
        />
      </button>
    </li>
  );
}
