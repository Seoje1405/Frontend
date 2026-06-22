'use client';

import { formatPhone } from '@/lib/schema/phone';
import { CircleAlert, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

type Phase = 'empty' | 'code-sent' | 'error';

const CODE_TTL = 180;

export function PhoneVerifyForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('empty');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(CODE_TTL);
  const [timerAlert, setTimerAlert] = useState('');
  const [timerKey, setTimerKey] = useState(0);
  const [pending, start] = useTransition();
  const composing = useRef(false);
  const codeRef = useRef<HTMLInputElement | null>(null);
  const needsFocusRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const lastAlertRef = useRef<number | null>(null);

  const phoneOk = phone.replace(/\D/g, '').length === 11;
  const codeOk = code.length === 6;
  const hasCodeField = phase !== 'empty';
  const canNext = phoneOk && codeOk && phase !== 'error';

  useEffect(() => {
    if (phase === 'empty' || !startTimeRef.current) return;
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      const remaining = Math.max(0, CODE_TTL - elapsed);
      setLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        return;
      }
      for (const threshold of [60, 30] as const) {
        if (remaining <= threshold && lastAlertRef.current !== threshold) {
          lastAlertRef.current = threshold;
          setTimerAlert(`인증번호 입력 시간이 ${threshold}초 남았습니다.`);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [phase, timerKey]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  function sendCode() {
    start(async () => {
      needsFocusRef.current = true;
      startTimeRef.current = Date.now();
      lastAlertRef.current = null;
      setCode('');
      setLeft(CODE_TTL);
      setTimerAlert('');
      setTimerKey((k) => k + 1);
      setPhase('code-sent');
    });
  }

  function submit() {
    start(async () => {
      // UI 전용: 123456 고정값으로 검증
      const ok = code === '123456';
      if (ok) router.push('/onboarding/step2');
      else setPhase('error');
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === 'empty' && phoneOk) {
      sendCode();
    } else if (canNext) {
      submit();
    }
  }

  return (
    <>
      {/* 타이머 임계값 도달 시 스크린 리더 고지 (시각적으로 숨김) */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {timerAlert}
      </span>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-5.5 px-5.5 pt-7.5">
          {/* 휴대폰 번호 */}
          <div className="flex flex-col gap-2.5">
            <label className="text-ink-700 text-sm font-semibold" htmlFor="phone">
              휴대폰 번호
            </label>
            <div className="flex gap-2.5">
              <input
                id="phone"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="border-line bg-card text-ink-900 placeholder:text-ink-400 focus-visible:border-primary focus-visible:ring-ring/30 h-14 min-w-0 flex-1 rounded-md border px-4.5 text-base tabular-nums focus-visible:ring-2 focus-visible:outline-none"
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={!phoneOk || pending}
                aria-busy={pending}
                className={`h-14 flex-none rounded-md px-4.5 text-sm font-bold whitespace-nowrap transition-colors duration-150 ${
                  phoneOk && !pending
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-ink-500'
                } focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed`}
              >
                인증번호 받기
              </button>
            </div>
          </div>

          {/* 인증번호 */}
          <div aria-live="polite" aria-atomic="true">
            {hasCodeField && (
              <div className="flex flex-col gap-2.5">
                <label className="text-ink-700 text-sm font-semibold" htmlFor="code">
                  인증번호
                </label>
                <div
                  className={`bg-card flex h-14 items-center rounded-md border px-4.5 transition-[border-color,box-shadow] focus-within:ring-2 ${
                    phase === 'error'
                      ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/30'
                      : 'border-line focus-within:border-primary focus-within:ring-ring/30'
                  }`}
                >
                  <input
                    ref={(el) => {
                      codeRef.current = el;
                      if (el && needsFocusRef.current) {
                        el.focus();
                        needsFocusRef.current = false;
                      }
                    }}
                    id="code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    aria-invalid={phase === 'error'}
                    aria-describedby={phase === 'error' ? 'code-error' : undefined}
                    placeholder="인증번호를 입력해주세요"
                    value={code}
                    onCompositionStart={() => {
                      composing.current = true;
                    }}
                    onCompositionEnd={(e) => {
                      composing.current = false;
                      setCode(e.currentTarget.value.replace(/\D/g, ''));
                    }}
                    onChange={(e) => {
                      if (!composing.current) {
                        setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      }
                      if (phase === 'error') setPhase('code-sent');
                    }}
                    className="text-ink-900 placeholder:text-ink-400 min-w-0 flex-1 bg-transparent text-base tabular-nums focus:outline-none"
                  />
                  <span
                    role="timer"
                    aria-label={`남은 시간 ${mm}분 ${ss}초`}
                    aria-live="off"
                    className={`ml-auto pl-2 text-sm font-semibold tabular-nums ${
                      phase === 'error' ? 'text-destructive' : 'text-ink-500'
                    }`}
                  >
                    {mm}:{ss}
                  </span>
                </div>

                {phase === 'error' && (
                  <p
                    id="code-error"
                    className="text-destructive mt-0.5 flex items-center gap-1.5 text-xs font-medium"
                    role="alert"
                  >
                    <CircleAlert
                      className="size-3.5 shrink-0"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    인증번호가 일치하지 않습니다. 다시 확인해 주세요.
                  </p>
                )}

                <button
                  type="button"
                  onClick={sendCode}
                  disabled={pending}
                  aria-busy={pending}
                  className="bg-surface text-primary border-line hover:bg-secondary focus-visible:ring-primary mt-3.5 flex h-14 w-full items-center justify-center gap-2 rounded-md border text-base font-bold whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <RefreshCw className="size-4" strokeWidth={2} aria-hidden="true" />
                  인증번호 재발송
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="px-5.5 pt-4.5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <button
            type="submit"
            disabled={!canNext || pending}
            aria-busy={pending}
            className="enabled:bg-primary enabled:text-primary-foreground enabled:shadow-fab disabled:bg-muted disabled:text-ink-400 focus-visible:ring-primary flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      </form>
    </>
  );
}
