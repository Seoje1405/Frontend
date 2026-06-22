'use client';

import { useEffect, useRef, useState } from 'react';

export const WHEEL_ROW_HEIGHT = 48;

interface WheelProps {
  values: string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  suffix?: string;
}

interface RippleState {
  v: string;
  id: number;
}

export function Wheel({ values, value, onChange, ariaLabel, suffix }: WheelProps) {
  const ref = useRef<HTMLUListElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rippleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rippleIdRef = useRef(0);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const idx = Math.max(0, values.indexOf(value));

  function handleItemClick(v: string) {
    const el = ref.current;
    if (!el) return;
    const targetIdx = values.indexOf(v);
    if (targetIdx < 0) return;

    if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    setRipple({ v, id: ++rippleIdRef.current });
    rippleTimerRef.current = setTimeout(() => setRipple(null), 400);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({
      top: targetIdx * WHEEL_ROW_HEIGHT,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const i = Math.round(el.scrollTop / WHEEL_ROW_HEIGHT);
        onChange(values[Math.min(values.length - 1, Math.max(0, i))]);
      }, 80);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onChange, values]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(values[Math.min(values.length - 1, idx + 1)]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(values[Math.max(0, idx - 1)]);
    }
  }

  useEffect(() => {
    ref.current?.scrollTo({ top: idx * WHEEL_ROW_HEIGHT, behavior: 'instant' });
  }, [idx]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rippleTimerRef.current) clearTimeout(rippleTimerRef.current);
    };
  }, []);

  return (
    <ul
      ref={ref}
      onKeyDown={onKeyDown}
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={values.length - 1}
      aria-valuenow={idx}
      aria-valuetext={suffix ? `${value}${suffix}` : value}
      tabIndex={0}
      className="focus-visible:ring-primary/60 relative h-full snap-y snap-mandatory list-none overflow-y-auto py-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset [&::-webkit-scrollbar]:hidden"
    >
      {values.map((v) => (
        <li
          key={v}
          aria-hidden="true"
          onClick={() => handleItemClick(v)}
          className={`relative flex h-12 snap-center items-center justify-center overflow-hidden text-2xl leading-none tabular-nums transition-transform duration-100 active:scale-90 ${
            v === value
              ? 'text-ink-900 font-extrabold'
              : 'text-ink-400 cursor-pointer font-semibold'
          }`}
        >
          {ripple?.v === v && (
            <span
              key={ripple.id}
              aria-hidden="true"
              className="bg-primary/20 animate-wheel-ripple pointer-events-none absolute top-1/2 left-1/2 size-10 rounded-full"
            />
          )}
          {suffix ? (
            <>
              <span>{v}</span>
              <span
                className={`transition-opacity duration-200 ${v === value ? 'opacity-100' : 'opacity-0'}`}
              >
                {suffix}
              </span>
            </>
          ) : (
            v
          )}
        </li>
      ))}
    </ul>
  );
}
