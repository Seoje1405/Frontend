'use client';

import { cn } from '@/lib/utils';
import { BriefcaseMedical, House, Plus, ShieldCheck, User, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  variant?: 'tab' | 'disc';
};

const NAV_ITEMS = [
  { key: 'home', label: '홈', href: '/home', icon: House },
  { key: 'note', label: '약물노트', href: '/note', icon: BriefcaseMedical },
  { key: 'register', label: '등록하기', href: '/register', icon: Plus, variant: 'disc' },
  { key: 'report', label: '리포트', href: '/report', icon: ShieldCheck },
  { key: 'my', label: '마이페이지', href: '/my', icon: User },
] as const satisfies readonly NavItem[];

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="주요 메뉴"
      className="bottom-nav border-line bg-card flex items-end justify-evenly border-t px-1.5 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      {NAV_ITEMS.map(({ key, label, href, icon: Icon, variant }: NavItem) => {
        const active = isActive(href);

        if (variant === 'disc') {
          return (
            <Link
              key={key}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className="group flex min-w-14 flex-col items-center gap-1.5 rounded-md focus-visible:outline-none"
            >
              <div className="bg-primary shadow-fab group-focus-visible:ring-primary grid size-11 place-items-center rounded-full group-focus-visible:ring-2 group-focus-visible:ring-offset-1">
                <Icon
                  size={21}
                  strokeWidth={2.4}
                  aria-hidden={true}
                  className="text-primary-foreground"
                />
              </div>
              <span aria-hidden={true} className="text-primary text-2xs font-bold">
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={key}
            href={href}
            aria-current={active ? 'page' : undefined}
            className="group focus-visible:ring-primary flex min-h-11 min-w-14 flex-col items-center gap-1.5 self-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <Icon
              size={26}
              strokeWidth={1.9}
              aria-hidden={true}
              className={cn(active ? 'text-primary' : 'text-ink-400 group-hover:text-primary')}
            />
            <span
              className={cn(
                'text-2xs font-semibold',
                active ? 'text-primary' : 'text-ink-400 group-hover:text-primary',
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
