'use client';

import { useRef } from 'react';

export type Gender = 'M' | 'F';

const GENDER_OPTIONS: { key: Gender; label: string }[] = [
  { key: 'M', label: '남성' },
  { key: 'F', label: '여성' },
];

export function GenderSegmented({
  value,
  onChange,
}: {
  value: Gender | null;
  onChange: (g: Gender) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    const len = GENDER_OPTIONS.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (idx + 1) % len;
    if (e.key === 'ArrowLeft') next = (idx - 1 + len) % len;
    if (next !== null) {
      e.preventDefault();
      onChange(GENDER_OPTIONS[next].key);
      refs.current[next]?.focus();
    }
  }

  return (
    <div role="radiogroup" aria-label="성별" className="bg-muted flex h-14 rounded-lg p-1">
      {GENDER_OPTIONS.map((o, idx) => {
        const selected = value === o.key;
        return (
          <button
            key={o.key}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!value && idx === 0) ? 0 : -1}
            onClick={() => onChange(o.key)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex-1 rounded-md text-base font-bold transition-colors duration-150 ${
              selected
                ? 'bg-card text-ink-900 shadow-card'
                : 'text-ink-700 hover:bg-card/50 hover:text-ink-900'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
