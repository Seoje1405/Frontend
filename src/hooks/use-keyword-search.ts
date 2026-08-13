'use client';

import { useEffect, useState } from 'react';
import { useDebouncedValue } from './use-debounced-value';

interface UseKeywordSearchResult<T> {
  results: T[];
  isLoading: boolean;
  hasQuery: boolean;
  error: string | null;
}

// keyword 기반 자동완성 검색 API를 디바운스 + AbortController로 호출하는 공용 훅
// (medication-add/search, hospital-search-input에서 중복되던 로직을 통합)
export function useKeywordSearch<T>(
  query: string,
  searchUrl: string,
  delayMs = 300,
): UseKeywordSearchResult<T> {
  const [results, setResults] = useState<T[]>([]);
  // results가 어느 검색어에 대한 응답인지 추적 — debouncedQuery와 다르면 아직 로딩 중인 것으로 간주(파생 상태)
  const [resultsQuery, setResultsQuery] = useState('');
  const [rawError, setRawError] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query, delayMs);
  const hasQuery = debouncedQuery.trim().length > 0;
  const isLoading = hasQuery && resultsQuery !== debouncedQuery.trim();
  // 검색어가 지워지면 드롭다운/결과 영역이 사라지므로 이전 에러를 계속 노출하지 않음(effect 없이 렌더 중 파생)
  const error = hasQuery ? rawError : null;

  useEffect(() => {
    const keyword = debouncedQuery.trim();
    if (!keyword) return;

    const controller = new AbortController();
    fetch(`${searchUrl}?keyword=${encodeURIComponent(keyword)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('검색에 실패했어요.');
        return res.json() as Promise<T[]>;
      })
      .then((data) => {
        setResults(data);
        setResultsQuery(keyword);
        setRawError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          setRawError(err.message);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery, searchUrl]);

  return { results, isLoading, hasQuery, error };
}
