'use client';

import { useKeywordSearch } from '@/hooks/use-keyword-search';
import type { HospitalSearchResponse } from '@/types/api';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HospitalSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function HospitalSearchInput({ value, onChange }: HospitalSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, hasQuery } = useKeywordSearch<HospitalSearchResponse>(
    value,
    '/api/hospitals/search',
  );

  // 드롭다운이 열려있을 때만 바깥 클릭 감지 리스너를 등록 — 닫힌 상태에서는 불필요한 리스너 비용을 줄임
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  function handleSelect(hospital: HospitalSearchResponse) {
    onChange(hospital.name);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <Search
        size={16}
        className="text-ink-400 absolute top-1/2 left-3 -translate-y-1/2"
        aria-hidden
      />
      <input
        id="hospital-name"
        type="text"
        placeholder="병원을 입력하세요"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
        className="border-border bg-background placeholder:text-ink-500 focus:border-primary focus:ring-primary w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:ring-1 focus:outline-none"
      />
      {isOpen && hasQuery && results.length > 0 ? (
        <ul className="border-border bg-card shadow-raised z-dropdown absolute mt-1 max-h-48 w-full overflow-y-auto rounded-md border">
          {results.map((hospital) => (
            <li key={hospital.id}>
              <button
                type="button"
                onClick={() => handleSelect(hospital)}
                className="hover:bg-accent flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left"
              >
                <span className="text-foreground text-sm font-medium">{hospital.name}</span>
                {hospital.address ? (
                  <span className="text-muted-foreground text-xs">{hospital.address}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
