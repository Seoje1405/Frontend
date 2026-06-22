'use client';

import { saveMealTimes } from '@/lib/actions/parent';
import { Clock, Moon, Sun, Sunrise } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { TimePickerDrawer } from './TimePickerDrawer';

type MealKey = 'morning' | 'noon' | 'night';
type Meals = Record<MealKey, string>;

const MEALS: { key: MealKey; label: string; icon: React.ReactNode }[] = [
  {
    key: 'morning',
    label: '아침 식사 시간',
    icon: <Sunrise className="text-meal-morning size-5.5" strokeWidth={1.9} aria-hidden="true" />,
  },
  {
    key: 'noon',
    label: '점심 식사 시간',
    icon: <Sun className="text-meal-noon size-5.5" strokeWidth={2} aria-hidden="true" />,
  },
  {
    key: 'night',
    label: '저녁 식사 시간',
    icon: <Moon className="text-meal-night size-5.5" strokeWidth={1.9} aria-hidden="true" />,
  },
];

export function MealTimeForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [meals, setMeals] = useState<Meals>({
    morning: '오전 8:00',
    noon: '오후 12:00',
    night: '오후 6:00',
  });
  const [editing, setEditing] = useState<MealKey | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState('');

  function handleConfirm(time: string) {
    if (editing) {
      const label = MEALS.find((m) => m.key === editing)?.label ?? '';
      setMeals((prev) => ({ ...prev, [editing]: time }));
      setAnnouncement(`${label}이(가) ${time}으로 변경되었습니다.`);
    }
    setEditing(null);
  }

  function handleSkip() {
    start(async () => {
      router.push('/');
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    start(async () => {
      try {
        await saveMealTimes(meals);
        router.push('/');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : '저장 중 오류가 발생했습니다. 다시 시도해주세요.';
        setError(message);
      }
    });
  }

  return (
    <>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      <span className="sr-only" aria-live="assertive" aria-atomic="true">
        {error}
      </span>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-3.5 px-5.5 pt-7.5">
          {MEALS.map((m) => (
            <div key={m.key} className="bg-card shadow-card rounded-xl p-4 pb-5">
              <div className="text-ink-700 flex items-center gap-2.5 text-sm font-semibold">
                <span className="grid size-5.5 place-items-center">{m.icon}</span>
                {m.label}
              </div>
              <button
                type="button"
                onClick={() => setEditing(m.key)}
                aria-label={`${m.label}: ${meals[m.key]}. 변경`}
                className="bg-muted text-ink-900 focus-visible:ring-primary hover:bg-secondary mt-3 flex h-14 w-full items-center rounded-md px-4.5 text-left text-xl font-bold tabular-nums transition focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]"
              >
                {meals[m.key]}
                <Clock
                  className="text-ink-500 ml-auto size-5 shrink-0"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </button>
            </div>
          ))}
        </div>

        {/* 하단 CTA */}
        <div className="px-5.5 pt-4.5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {!!error && (
            <p className="kr-wrap text-danger mb-3 text-sm" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleSkip}
              disabled={pending}
              aria-busy={pending}
              className="border-line bg-surface text-ink-900 focus-visible:ring-primary hover:bg-secondary h-14 flex-1 rounded-2xl border text-base font-bold transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              건너뛰기
            </button>
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="bg-primary text-primary-foreground shadow-fab focus-visible:ring-primary h-14 flex-[1.7] rounded-2xl text-base font-bold transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              완료하기
            </button>
          </div>
        </div>
      </form>

      <TimePickerDrawer
        key={editing ?? 'closed'}
        open={editing !== null}
        value={editing ? meals[editing] : meals.morning}
        onClose={() => setEditing(null)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
