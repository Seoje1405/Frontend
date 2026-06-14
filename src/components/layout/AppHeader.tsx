import { Bell, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface AppHeaderProps {
  name?: string;
  expanded?: boolean;
}

export function AppHeader({ name = '000', expanded = false }: AppHeaderProps) {
  return (
    <header className="app-header border-line bg-surface-2 z-sticky relative flex items-center justify-between border-b px-4.5 pt-4 pb-3">
      {/* 계정 스위처: 클릭 시 expanded 토글 → 아이콘 ChevronDown↔Up 전환, 콘텐츠 영역에 프로필 목록 오버레이 표시 */}
      <Link
        href="/parents"
        aria-label={name === '000' ? '부모님 추가' : `부모님 전환, 현재 ${name}`}
        aria-expanded={expanded}
        aria-haspopup="dialog"
        className="focus-visible:ring-primary flex min-h-[44px] items-center gap-2 transition-opacity duration-150 hover:opacity-80 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        <span className="bg-ink-300 size-7 flex-none rounded-full" aria-hidden="true" />
        <span className="text-brand-link text-base font-bold">{name}</span>
        {expanded ? (
          <ChevronUp size={18} strokeWidth={2.2} className="text-brand-link" aria-hidden="true" />
        ) : (
          <ChevronDown size={18} strokeWidth={2.2} className="text-brand-link" aria-hidden="true" />
        )}
      </Link>

      {/* 알림 — tap target 44px 확보 */}
      {/* 추후 aria-label을 동적으로 업데이트 */}

      <Link
        href="/notifications"
        aria-label="알림"
        className="text-ink-700 focus-visible:ring-primary -m-2.5 p-2.5 transition-opacity duration-150 hover:opacity-80 focus-visible:rounded-md focus-visible:ring-1 focus-visible:outline-none"
      >
        <Bell size={24} strokeWidth={1.9} />
      </Link>
    </header>
  );
}
