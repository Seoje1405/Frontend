import { MED_COLOR_CLASSES } from '@/lib/constants/med-colors';
import type { NoteMedication, NoteStatus } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { Pill } from 'lucide-react';
import Link from 'next/link';
import { NoteMoreMenu } from './note-more-menu';

const STATUS_BADGE: Record<NoteStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-status-active-bg', text: 'text-status-active', label: '복용 중' },
  completed: { bg: 'bg-status-done-bg', text: 'text-status-done', label: '복용 완료' },
  stopped: { bg: 'bg-danger-bg', text: 'text-danger', label: '복용 중단' },
};

interface NoteMedItemProps {
  medication: NoteMedication;
}

export function NoteMedItem({ medication }: NoteMedItemProps) {
  const color = MED_COLOR_CLASSES[medication.color];
  const badge = STATUS_BADGE[medication.status];

  return (
    <div className="flex items-center gap-2 py-3">
      {/* medicationId 단건 API(PATCH/DELETE)와 1:1로 대응시키기 위해 병원 그룹이 아닌 개별 약 행에 배치 */}
      <Link
        href={`/note/${medication.id}`}
        className="focus-visible:ring-primary flex min-w-0 flex-1 items-center gap-3 transition-opacity duration-100 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:outline-none active:opacity-70"
      >
        {/* 약 아이콘 박스 */}
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl',
            color.iconBg,
          )}
          aria-hidden
        >
          <Pill size={22} className={color.iconColor} />
        </div>

        {/* 약물 정보 */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {/* 약 종류 + 상태 뱃지 */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-ink-500 text-sm">{medication.kind}</span>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                badge.bg,
                badge.text,
              )}
            >
              {badge.label}
            </span>
          </div>

          {/* 약명 */}
          <span className="text-foreground text-base font-semibold">{medication.name}</span>

          {/* 복용 정보 칩 */}
          <div className="mt-1 flex flex-wrap gap-1.5">
            {medication.dosageInfo.map((info) => (
              <span
                key={info}
                className={cn(
                  'rounded-md px-2 py-0.5 text-xs font-medium',
                  color.chipBg,
                  color.chipText,
                )}
              >
                {info}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <NoteMoreMenu medicationId={medication.id} medicationName={medication.name} />
    </div>
  );
}
