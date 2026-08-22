'use client';

import { useKeywordSearch } from '@/hooks/use-keyword-search';
import type { NotePrescription, NoteStatus } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DateFilterBadge } from './date-filter-badge';
import { NotePrescriptionGroup } from './note-prescription-group';

type NoteFilter = 'all' | NoteStatus;

const FILTER_OPTIONS: { value: NoteFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '복용 중' },
  { value: 'stopped', label: '복용 중단' },
  { value: 'completed', label: '복용 완료' },
];

// 백엔드는 상대 기간(1주/1개월/3개월/1년)만 지원 — 선택한 시작일과 오늘까지의 거리로 가장 가까운 구간을 고름
function derivePeriod(from: string): '1w' | '1m' | '3m' | '1y' {
  const days = dayjs().diff(dayjs(from), 'day');
  if (days <= 7) return '1w';
  if (days <= 31) return '1m';
  if (days <= 93) return '3m';
  return '1y';
}

// period가 상대 구간 단위라 정확한 범위 조회가 안 되므로, 응답을 받은 뒤 선택한 from~to로 한 번 더 걸러냄
function filterByDateRange(
  prescriptions: NotePrescription[],
  from: string,
  to: string,
): NotePrescription[] {
  if (!from && !to) return prescriptions;

  return prescriptions.filter((prescription) => {
    const date = dayjs(prescription.prescriptionDate, 'YYYY.MM.DD');
    if (from && date.isBefore(dayjs(from), 'day')) return false;
    if (to && date.isAfter(dayjs(to), 'day')) return false;
    return true;
  });
}

interface NoteListClientProps {
  prescriptions: NotePrescription[];
}

export function NoteListClient({ prescriptions }: NoteListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const dateFrom = searchParams.get('from') ?? '';
  const dateTo = searchParams.get('to') ?? '';
  const isSearching = query.trim().length > 0;

  const extraParams = useMemo<Record<string, string>>(() => {
    const params: Record<string, string> = {};
    if (dateFrom) params.period = derivePeriod(dateFrom);
    return params;
  }, [dateFrom]);
  const { results: searchResults } = useKeywordSearch<NotePrescription>(
    query,
    '/api/notes/search',
    300,
    extraParams,
  );

  const sourcePrescriptions = isSearching
    ? filterByDateRange(searchResults, dateFrom, dateTo)
    : prescriptions;

  function handleDateFilterClick() {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    router.push(`/note/search/date-filter?${params.toString()}`);
  }

  const [filter, setFilter] = useState<NoteFilter>('all');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const currentLabel = FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? '전체';

  // Escape 키로 닫고 트리거로 포커스 복귀
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // 드롭다운이 열릴 때 현재 선택된 옵션으로 포커스 이동
  useEffect(() => {
    if (!open || !listboxRef.current) return;
    const buttons = Array.from(listboxRef.current.querySelectorAll<HTMLButtonElement>('button'));
    const selectedIdx = FILTER_OPTIONS.findIndex((o) => o.value === filter);
    (buttons[Math.max(0, selectedIdx)] ?? buttons[0])?.focus();
    // open 변화 시에만 실행 — filter는 초기 포커스 위치 계산용으로만 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleListKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    const buttons = Array.from(
      listboxRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [],
    );
    const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      buttons[(idx + 1) % buttons.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      buttons[(idx - 1 + buttons.length) % buttons.length]?.focus();
    }
  }

  function selectFilter(value: NoteFilter) {
    setFilter(value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  const filteredPrescriptions = sourcePrescriptions
    .map((prescription) => ({
      ...prescription,
      hospitals: prescription.hospitals
        .map((hospital) => ({
          ...hospital,
          medications:
            filter === 'all'
              ? hospital.medications
              : hospital.medications.filter((med) => med.status === filter),
        }))
        .filter((hospital) => hospital.medications.length > 0),
    }))
    .filter((prescription) => prescription.hospitals.length > 0);

  return (
    <div className="flex flex-col gap-6 px-4 pt-3 pb-6">
      {/* 검색 중 날짜 필터 + 전역 상태 필터 */}
      <div className="flex items-center justify-between gap-2">
        {isSearching ? (
          <DateFilterBadge
            from={dateFrom || undefined}
            to={dateTo || undefined}
            onClick={handleDateFilterClick}
          />
        ) : (
          <div aria-hidden />
        )}

        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="border-line bg-card text-ink-700 hover:bg-muted flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors"
          >
            {currentLabel}
            <ChevronDown
              size={12}
              aria-hidden
              className={cn('transition-transform duration-150', open && 'rotate-180')}
            />
          </button>

          {open ? (
            <>
              <div className="z-raised fixed inset-0" onClick={() => setOpen(false)} aria-hidden />
              <ul
                ref={listboxRef}
                role="listbox"
                aria-label="복약 상태 필터"
                onKeyDown={handleListKeyDown}
                className="z-dropdown bg-card shadow-raised absolute top-full right-0 mt-1 min-w-[7.5rem] overflow-hidden rounded-xl"
              >
                {FILTER_OPTIONS.map((option) => (
                  <li key={option.value} role="option" aria-selected={filter === option.value}>
                    <button
                      type="button"
                      onClick={() => selectFilter(option.value)}
                      className={cn(
                        'w-full px-4 py-3 text-left text-sm transition-colors',
                        filter === option.value
                          ? 'bg-status-active-bg text-primary font-medium'
                          : 'text-foreground hover:bg-muted',
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>

      {/* 처방 목록 */}
      {filteredPrescriptions.length === 0 ? (
        <p className="kr-wrap text-ink-500 py-8 text-center text-sm">
          {isSearching ? '검색 결과가 없습니다.' : '해당 조건의 약물이 없습니다.'}
        </p>
      ) : (
        filteredPrescriptions.map((prescription) => (
          <NotePrescriptionGroup key={prescription.id} prescription={prescription} />
        ))
      )}
    </div>
  );
}
