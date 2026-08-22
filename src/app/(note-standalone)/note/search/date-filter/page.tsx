'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { CalendarDays, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const PRESETS = ['1주', '1개월', '3개월', '1년'] as const;
type PresetLabel = (typeof PRESETS)[number];

function calcPresetRange(label: PresetLabel): { from: string; to: string } {
  const today = dayjs();
  const map: Record<PresetLabel, dayjs.Dayjs> = {
    '1주': today.subtract(1, 'week').add(1, 'day'),
    '1개월': today.subtract(1, 'month').add(1, 'day'),
    '3개월': today.subtract(3, 'month').add(1, 'day'),
    '1년': today.subtract(1, 'year').add(1, 'day'),
  };
  return { from: map[label].format('YYYY-MM-DD'), to: today.format('YYYY-MM-DD') };
}

/* ─── 미니 캘린더 ─────────────────────────────────────────── */

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface MiniCalendarProps {
  value: string;
  onChange: (date: string) => void;
}

function MiniCalendar({ value, onChange }: MiniCalendarProps) {
  const today = dayjs();
  const selected = value ? dayjs(value) : null;
  const [viewMonth, setViewMonth] = useState(
    selected ? selected.startOf('month') : today.startOf('month'),
  );

  const firstDayOfWeek = viewMonth.startOf('month').day();
  const daysInMonth = viewMonth.daysInMonth();

  const cells: (number | null)[] = [
    ...Array<null>(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="shadow-card bg-card mt-2 rounded-xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          onClick={() => setViewMonth((m) => m.subtract(1, 'month'))}
          className="text-ink-500 hover:bg-ink-100 focus-visible:ring-primary rounded-md p-1.5 focus-visible:ring-1 focus-visible:outline-none"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        <span className="text-foreground text-sm font-semibold">
          {viewMonth.format('YYYY년 M월')}
        </span>
        <button
          type="button"
          aria-label="다음 달"
          onClick={() => setViewMonth((m) => m.add(1, 'month'))}
          className="text-ink-500 hover:bg-ink-100 focus-visible:ring-primary rounded-md p-1.5 focus-visible:ring-1 focus-visible:outline-none"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={cn(
              'py-1 text-center text-xs font-medium',
              i === 0 ? 'text-danger' : 'text-ink-500',
            )}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} className="py-1.5" />;

          const dateStr = viewMonth.date(day).format('YYYY-MM-DD');
          const isSelected = selected?.format('YYYY-MM-DD') === dateStr;
          const isToday = today.format('YYYY-MM-DD') === dateStr;
          const isSunday = idx % 7 === 0;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onChange(dateStr)}
              className={cn(
                'focus-visible:ring-primary flex items-center justify-center rounded-full py-1.5 text-xs transition-colors focus-visible:ring-1 focus-visible:outline-none',
                isSelected
                  ? 'bg-primary font-semibold text-white'
                  : isToday
                    ? 'text-primary ring-primary/40 font-semibold ring-1 ring-inset'
                    : isSunday
                      ? 'text-danger hover:bg-ink-100'
                      : 'text-foreground hover:bg-ink-100',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 날짜 선택 페이지 ──────────────────────────────────────── */

function DateFilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const [from, setFrom] = useState(searchParams.get('from') ?? '');
  const [to, setTo] = useState(searchParams.get('to') ?? '');
  const [activePreset, setActivePreset] = useState<PresetLabel | null>(null);
  const [openCalendar, setOpenCalendar] = useState<'from' | 'to' | null>(null);

  function applyPreset(label: PresetLabel) {
    const range = calcPresetRange(label);
    setFrom(range.from);
    setTo(range.to);
    setActivePreset(label);
    setOpenCalendar(null);
  }

  function handleDateChange(target: 'from' | 'to', date: string) {
    if (target === 'from') setFrom(date);
    else setTo(date);
    setActivePreset(null);
    setOpenCalendar(null);
  }

  function toggleCalendar(target: 'from' | 'to') {
    setOpenCalendar((prev) => (prev === target ? null : target));
  }

  function handleReset() {
    setFrom('');
    setTo('');
    setActivePreset(null);
    setOpenCalendar(null);
  }

  const isRangeInvalid = !!(from && to && from > to);

  function handleApply() {
    if (isRangeInvalid) return;
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    router.push(`/note?${params.toString()}`);
  }

  return (
    <>
      {/* 헤더 */}
      <header className="border-line bg-surface-2 flex items-center border-b px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-3">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => router.back()}
          className="text-ink-700 focus-visible:ring-primary -m-2.5 rounded-md p-2.5 focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronLeft size={24} aria-hidden />
        </button>
        <h1 className="text-foreground flex-1 text-center text-base font-semibold">날짜 선택</h1>
        <div className="size-9" aria-hidden />
      </header>

      {/* 본문 */}
      <div className="flex-1 px-4 pt-6">
        {/* 조회기간 */}
        <p className="text-foreground mb-2.5 text-sm font-semibold">조회기간</p>
        <div className="mb-4 flex gap-2">
          {PRESETS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => applyPreset(label)}
              className={cn(
                'focus-visible:ring-primary flex-1 rounded-lg py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                activePreset === label
                  ? 'bg-primary text-white'
                  : 'border-line bg-card text-ink-700 hover:border-primary border',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 날짜 범위 입력 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleCalendar('from')}
            className={cn(
              'focus-visible:ring-primary flex flex-1 items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
              openCalendar === 'from' ? 'border-primary' : 'border-line',
              from ? 'text-foreground' : 'text-ink-400',
            )}
          >
            <span className="flex-1 text-left">{from || '날짜 선택'}</span>
            <CalendarDays
              size={15}
              className={from ? 'text-primary' : 'text-ink-400'}
              aria-hidden
            />
          </button>

          <span className="text-ink-400 shrink-0 text-sm" aria-hidden>
            ~
          </span>

          <button
            type="button"
            onClick={() => toggleCalendar('to')}
            className={cn(
              'focus-visible:ring-primary flex flex-1 items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
              openCalendar === 'to' ? 'border-primary' : 'border-line',
              to ? 'text-foreground' : 'text-ink-400',
            )}
          >
            <span className="flex-1 text-left">{to || '날짜 선택'}</span>
            <CalendarDays size={15} className={to ? 'text-primary' : 'text-ink-400'} aria-hidden />
          </button>
        </div>

        {/* 미니 캘린더 팝업 */}
        {openCalendar && (
          <MiniCalendar
            value={openCalendar === 'from' ? from : to}
            onChange={(date) => handleDateChange(openCalendar, date)}
          />
        )}

        {/* 유효성 에러 / 안내 텍스트 */}
        {isRangeInvalid ? (
          <div className="mt-3 flex items-start gap-1.5" role="alert">
            <Info size={13} className="text-danger mt-0.5 shrink-0" aria-hidden />
            <p className="text-danger text-xs">시작일이 종료일보다 늦을 수 없습니다.</p>
          </div>
        ) : (
          <div className="mt-3 flex items-start gap-1.5">
            <Info size={13} className="text-primary mt-0.5 shrink-0" aria-hidden />
            <p className="text-primary text-xs">최대 1년 이내, 일 단위로 선택할 수 있습니다</p>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="border-line bg-surface-2 flex gap-2 border-t px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          초기화
        </Button>
        <Button className="flex-[2]" onClick={handleApply} disabled={isRangeInvalid}>
          조회
        </Button>
      </div>
    </>
  );
}

export default function DateFilterPage() {
  return (
    <Suspense>
      <DateFilterContent />
    </Suspense>
  );
}
