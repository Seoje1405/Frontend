'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Wheel } from '@/components/ui/wheel';
import { useState } from 'react';

export type Birth = { d: string; m: string; y: string };

const THIS_YEAR = new Date().getFullYear();

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 81 }, (_, i) => String(THIS_YEAR - 19 - i));

interface BirthPickerDrawerProps {
  open: boolean;
  value: Birth | null;
  onClose: () => void;
  onConfirm: (v: Birth) => void;
}

export function BirthPickerDrawer({ open, value, onClose, onConfirm }: BirthPickerDrawerProps) {
  const [d, setD] = useState(value?.d ?? '15');
  const [m, setM] = useState(value?.m ?? '3');
  const [y, setY] = useState(value?.y ?? String(THIS_YEAR - 60));

  return (
    <Drawer
      shouldScaleBackground={false}
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DrawerContent className="rounded-t-3xl px-5.5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <DrawerHeader className="flex flex-row items-center justify-between px-0 pt-3.5 pb-3.5">
          <DrawerTitle className="text-ink-900 text-xl font-semibold">생년월일 선택</DrawerTitle>
          <DrawerClose className="text-primary -mr-2 min-h-11 min-w-11 px-2 text-base font-semibold">
            닫기
          </DrawerClose>
        </DrawerHeader>

        <div className="bg-card relative grid h-60 grid-cols-3 overflow-hidden rounded-xl">
          {/* 선택 하이라이트 밴드 */}
          <span
            className="bg-primary/6 pointer-events-none absolute inset-x-3.5 top-1/2 h-12 -translate-y-1/2 rounded-md"
            aria-hidden="true"
          />
          {/* 상단 페이드 */}
          <span
            className="from-card pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b to-transparent"
            aria-hidden="true"
          />
          {/* 하단 페이드 */}
          <span
            className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent"
            aria-hidden="true"
          />

          <Wheel values={YEARS} value={y} onChange={setY} suffix="년" ariaLabel="년" />
          <Wheel values={MONTHS} value={m} onChange={setM} suffix="월" ariaLabel="월" />
          <Wheel values={DAYS} value={d} onChange={setD} suffix="일" ariaLabel="일" />
        </div>

        <button
          type="button"
          onClick={() => onConfirm({ d, m, y })}
          className="bg-primary text-primary-foreground shadow-fab focus-visible:ring-primary mt-4 h-14 w-full rounded-2xl text-base font-bold transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
        >
          완료하기
        </button>
      </DrawerContent>
    </Drawer>
  );
}
