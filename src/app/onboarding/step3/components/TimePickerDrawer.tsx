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

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const AMPM = ['오전', '오후'];

const KO_TIME_RE = /^(오전|오후)\s+(\d+):(\d+)$/;
const EN_TIME_RE = /(\d+):(\d+)\s*(AM|PM)/i;

function parse(v: string): { h: string; min: string; ap: string } {
  const koMatch = v.match(KO_TIME_RE);
  if (koMatch) {
    return { h: koMatch[2], min: koMatch[3].padStart(2, '0'), ap: koMatch[1] };
  }
  const enMatch = v.match(EN_TIME_RE);
  if (enMatch) {
    return {
      h: enMatch[1],
      min: enMatch[2].padStart(2, '0'),
      ap: enMatch[3].toUpperCase() === 'AM' ? '오전' : '오후',
    };
  }
  return { h: '8', min: '00', ap: '오전' };
}

interface TimePickerDrawerProps {
  open: boolean;
  value: string;
  onClose: () => void;
  onConfirm: (time: string) => void;
}

export function TimePickerDrawer({ open, value, onClose, onConfirm }: TimePickerDrawerProps) {
  const { h: initH, min: initMin, ap: initAp } = parse(value);
  const [h, setH] = useState(initH);
  const [min, setMin] = useState(initMin);
  const [ap, setAp] = useState(initAp);

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
          <DrawerTitle className="text-ink-900 text-xl font-semibold">시간 선택</DrawerTitle>
          <DrawerClose className="text-primary -mr-2 min-h-11 min-w-11 px-2 text-base font-semibold">
            닫기
          </DrawerClose>
        </DrawerHeader>

        <div className="bg-card relative grid h-60 grid-cols-3 overflow-hidden rounded-xl">
          <span
            className="bg-primary/6 pointer-events-none absolute inset-x-3.5 top-1/2 h-12 -translate-y-1/2 rounded-md"
            aria-hidden="true"
          />
          <span
            className="from-card pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b to-transparent"
            aria-hidden="true"
          />
          <span
            className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent"
            aria-hidden="true"
          />

          <Wheel values={AMPM} value={ap} onChange={setAp} ariaLabel="오전 오후" />
          <Wheel values={HOURS} value={h} onChange={setH} ariaLabel="시" />
          <Wheel values={MINUTES} value={min} onChange={setMin} ariaLabel="분" />
        </div>

        <button
          type="button"
          onClick={() => onConfirm(`${ap} ${parseInt(h)}:${min}`)}
          className="bg-primary text-primary-foreground shadow-fab focus-visible:ring-primary mt-4 h-14 w-full rounded-2xl text-base font-bold focus-visible:ring-2 focus-visible:outline-none"
        >
          완료하기
        </button>
      </DrawerContent>
    </Drawer>
  );
}
