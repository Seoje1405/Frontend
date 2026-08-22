'use client';

import { useKeywordSearch } from '@/hooks/use-keyword-search';
import type { NotePrescription } from '@/lib/data/types';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useDeferredValue, useMemo, useState } from 'react';
import { DateFilterBadge } from './_components/date-filter-badge';
import { RecentSearches, useRecentSearches } from './_components/recent-searches';
import { SearchInput } from './_components/search-input';
import { SearchResults } from './_components/search-results';

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

function NoteSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateFrom = searchParams.get('from') ?? '';
  const dateTo = searchParams.get('to') ?? '';

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const deferredQuery = useDeferredValue(query);
  const { recents, addRecent, removeRecent, clearAll } = useRecentSearches();

  const extraParams = useMemo<Record<string, string>>(() => {
    const params: Record<string, string> = {};
    if (dateFrom) params.period = derivePeriod(dateFrom);
    return params;
  }, [dateFrom]);
  const { results: rawResults } = useKeywordSearch<NotePrescription>(
    deferredQuery,
    '/api/notes/search',
    300,
    extraParams,
  );
  const results = filterByDateRange(rawResults, dateFrom, dateTo);
  const showResults = deferredQuery.trim().length > 0;

  function handleSelectRecent(q: string) {
    setQuery(q);
    addRecent(q);
  }

  function handleSearchSubmit(q: string) {
    if (q.trim()) addRecent(q.trim());
  }

  function handleDateFilterClick() {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    router.push(`/note/search/date-filter?${params.toString()}`);
  }

  return (
    <>
      <h1 className="sr-only">약물 검색</h1>
      <SearchInput value={query} onSearch={setQuery} onSubmit={handleSearchSubmit} />

      {showResults ? (
        <div className="px-4 pt-3 pb-1">
          <DateFilterBadge
            from={dateFrom || undefined}
            to={dateTo || undefined}
            onClick={handleDateFilterClick}
          />
        </div>
      ) : null}

      <div className="flex-1 pt-2">
        {showResults ? (
          <SearchResults results={results} query={query.trim()} />
        ) : (
          <RecentSearches
            recents={recents}
            onSelect={handleSelectRecent}
            onRemove={removeRecent}
            onClearAll={clearAll}
          />
        )}
      </div>
    </>
  );
}

export default function NoteSearchPage() {
  return (
    <Suspense>
      <NoteSearchContent />
    </Suspense>
  );
}
