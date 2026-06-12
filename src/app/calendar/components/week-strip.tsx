'use client';

import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

const KO_DAY = ['일', '월', '화', '수', '목', '금', '토'] as const;

type WeekDay = {
  iso: string; // "2026-06-12"
  dayName: string; // "수"
  date: number; // 12
  isToday: boolean;
};

/** anchorISO가 속한 주(일요일 시작)의 7일을 만든다. 순수 함수 — 테스트 용이. */
function buildWeek(anchorISO: string): WeekDay[] {
  const anchor = dayjs(anchorISO);
  // startOf('week')는 dayjs 기본값으로 일요일 기준.
  const sunday = anchor.startOf('week');

  return Array.from({ length: 7 }, (_, i) => {
    const d = sunday.add(i, 'day');
    const iso = d.format('YYYY-MM-DD');
    return {
      iso,
      dayName: KO_DAY[d.day()],
      date: d.date(),
      isToday: iso === anchorISO,
    };
  });
}

type WeekStripProps = {
  /** 오늘 날짜(yyyy-MM-dd). 서버에서 계산해 전달. */
  anchorISO: string;
  /** 복약 일정이 있는 날짜(yyyy-MM-dd) — 점 표시. */
  markedISO?: readonly string[];
  /** 제어 모드: 선택된 날짜. 미지정 시 내부 상태(기본=오늘). */
  selectedISO?: string;
  /** 날짜 선택 콜백. */
  onSelectDate?: (iso: string) => void;
  className?: string;
};

export function WeekStrip({
  anchorISO,
  markedISO,
  selectedISO,
  onSelectDate,
  className,
}: WeekStripProps) {
  const week = buildWeek(anchorISO);
  const marked = new Set(markedISO ?? []);

  // 비제어 모드 기본 선택 = 오늘.
  const [internal, setInternal] = useState(anchorISO);
  const selected = selectedISO ?? internal;

  // 화살표 키 포커스 이동을 위한 버튼 ref 배열 (roving tabindex 패턴).
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleSelect = (iso: string) => {
    if (selectedISO === undefined) setInternal(iso);
    onSelectDate?.(iso);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const nextIndex = e.key === 'ArrowLeft' ? (index - 1 + 7) % 7 : (index + 1) % 7;
    handleSelect(week[nextIndex].iso);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="주간 날짜 선택"
      className={cn('flex gap-1.5 px-4 pt-4 pb-2.5', className)}
    >
      {week.map((day, index) => {
        const isSelected = day.iso === selected;
        const hasDot = marked.has(day.iso);

        return (
          <button
            key={day.iso}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            tabIndex={isSelected ? 0 : -1}
            aria-checked={isSelected}
            aria-current={day.isToday ? 'date' : undefined}
            aria-label={`${day.date}일 ${day.dayName}요일${day.isToday ? ', 오늘' : ''}${hasDot ? ', 복약 일정 있음' : ''}`}
            onClick={() => handleSelect(day.iso)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'group flex min-w-0 flex-1 cursor-pointer flex-col items-center rounded-xl',
              'border pt-2.5 pb-2 transition duration-150 outline-none',
              'focus-visible:ring-2 focus-visible:ring-offset-1',
              isSelected
                ? 'border-primary bg-primary shadow-fab focus-visible:ring-offset-primary focus-visible:ring-white/70'
                : cn(
                    'focus-visible:ring-ring/60',
                    'border-line bg-card hover:border-primary hover:bg-accent',
                    day.isToday && 'ring-primary/40 ring-1 ring-inset',
                  ),
            )}
          >
            <span
              className={cn(
                'text-2xs leading-none font-semibold',
                isSelected
                  ? 'text-primary-foreground'
                  : cn('text-ink-500 group-hover:text-primary', day.isToday && 'text-primary'),
              )}
            >
              {day.dayName}
            </span>
            <time
              dateTime={day.iso}
              className={cn(
                'mt-1 text-base leading-none font-bold',
                isSelected
                  ? 'text-primary-foreground'
                  : cn('text-ink-900 group-hover:text-primary', day.isToday && 'text-primary'),
              )}
            >
              {day.date}
            </time>
            {/* 복약 일정 점 — 자리 차지용으로 항상 렌더 */}
            <span
              aria-hidden
              className={cn(
                'mt-1 size-1 rounded-full transition-colors',
                isSelected ? 'bg-primary-foreground' : hasDot ? 'bg-primary' : 'bg-transparent',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
