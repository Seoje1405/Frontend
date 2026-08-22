'use client';

import { cn } from '@/lib/utils';
import { CalendarDays, ChevronDown } from 'lucide-react';

interface DateFilterBadgeProps {
  from?: string;
  to?: string;
  onClick: () => void;
}

export function DateFilterBadge({ from, to, onClick }: DateFilterBadgeProps) {
  const isSelected = !!(from && to);
  const label = isSelected ? `${from.replace(/-/g, '.')} ~ ${to.replace(/-/g, '.')}` : '날짜 선택';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isSelected ? `날짜 필터: ${label}, 변경` : '날짜 필터 선택'}
      className={cn(
        'focus-visible:ring-primary flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
        isSelected
          ? 'bg-primary text-primary-foreground shadow-fab'
          : 'border-line bg-card text-ink-700 hover:border-primary hover:bg-accent border',
      )}
    >
      <CalendarDays size={14} aria-hidden />
      <span>{label}</span>
      {isSelected && <ChevronDown size={13} aria-hidden />}
    </button>
  );
}
