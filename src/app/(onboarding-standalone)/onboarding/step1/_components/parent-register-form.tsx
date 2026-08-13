'use client';

import { GenderSegmented, type Gender } from '@/components/parent-form/gender-segmented';
import { BirthPickerDrawer, type Birth } from '@/components/ui/birth-picker-drawer';
import { registerParent, requestParentCode } from '@/lib/actions/parent';
import { formatPhone } from '@/lib/schema/phone';
import { Calendar, CircleAlert, CircleCheck, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

// 'filled'은 서버 검증이 아니라 6자리 입력 완료 상태 — 실제 검증은 registerParent(최종 등록)에서 이뤄짐
type CodePhase = 'idle' | 'code-sent' | 'error' | 'filled';

const DEFAULT_CODE_ERROR = '인증번호가 일치하지 않습니다. 다시 확인해 주세요.';

const CODE_TTL = 180;

// 카운트다운 표시만 별도 컴포넌트로 분리 — 1초마다 갱신되는 left state를
// 폼 전체(이름/성별/생년월일 등)가 아니라 이 컴포넌트만 리렌더되도록 격리
function CountdownTimer({
  startedAt,
  ttl,
  isError,
  onAlert,
}: {
  startedAt: number;
  ttl: number;
  isError: boolean;
  onAlert: (message: string) => void;
}) {
  const [left, setLeft] = useState(ttl);
  const lastAlertRef = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, ttl - elapsed);
      setLeft(remaining);
      if (remaining <= 0) {
        onAlert('인증번호 입력 시간이 만료되었습니다. 재발송 버튼을 눌러주세요.');
        clearInterval(id);
        return;
      }
      for (const threshold of [60, 30] as const) {
        if (remaining <= threshold && lastAlertRef.current !== threshold) {
          lastAlertRef.current = threshold;
          onAlert(`인증번호 입력 시간이 ${threshold}초 남았습니다.`);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt, ttl, onAlert]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <span
      role="timer"
      aria-label={`남은 시간 ${mm}분 ${ss}초`}
      aria-live="off"
      className={`ml-auto pl-2 text-sm font-semibold tabular-nums ${
        isError ? 'text-destructive' : 'text-ink-500'
      }`}
    >
      {mm}:{ss}
    </span>
  );
}

export function ParentRegisterForm() {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [birth, setBirth] = useState<Birth | null>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const [codePhase, setCodePhase] = useState<CodePhase>('idle');
  const [codeErrorMessage, setCodeErrorMessage] = useState(DEFAULT_CODE_ERROR);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [timerAlert, setTimerAlert] = useState('');
  const [timerKey, setTimerKey] = useState(0);
  const [statusAlert, setStatusAlert] = useState('');
  const composing = useRef(false);
  const codeRef = useRef<HTMLInputElement | null>(null);
  const needsFocusRef = useRef(false);
  // CountdownTimer에 prop으로 전달되어 렌더 중 읽히므로 ref가 아닌 state로 관리
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const nameOk = name.trim().length >= 1;
  const phoneOk = phone.replace(/\D/g, '').length === 11;
  const codeOk = code.length === 6;
  const canNext = nameOk && !!gender && !!birth && phoneOk && codeOk;

  function sendCode() {
    setStatusAlert('인증번호를 발송 중입니다.');
    start(async () => {
      const result = await requestParentCode(phone);
      if (!result.ok) {
        setStatusAlert(result.error);
        return;
      }
      needsFocusRef.current = true;
      setStartedAt(Date.now());
      setCode('');
      setTimerAlert('');
      setTimerKey((k) => k + 1);
      setStatusAlert('인증번호가 발송되었습니다.');
      setCodePhase('code-sent');
    });
  }

  function onCodeChange(v: string) {
    const next = v.replace(/\D/g, '').slice(0, 6);
    setCode(next);
    if (next.length === 6) {
      setCodePhase('filled');
    } else if (codePhase === 'error' || codePhase === 'filled') {
      setCodePhase('code-sent');
    }
  }

  function submit() {
    start(async () => {
      const result = await registerParent({
        name: name.trim(),
        gender,
        birth: `${birth!.y}-${birth!.m.padStart(2, '0')}-${birth!.d.padStart(2, '0')}`,
        phone,
        verificationCode: code,
      });
      if (result.ok) {
        router.push('/onboarding/step2');
      } else {
        setCodeErrorMessage(result.error);
        setCodePhase('error');
      }
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (canNext) submit();
  }

  const birthLabel = birth
    ? `${birth.y} / ${birth.m.padStart(2, '0')} / ${birth.d.padStart(2, '0')}`
    : 'YYYY / MM / DD';

  return (
    <>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {timerAlert}
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {statusAlert}
      </span>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4.5 px-5.5 pt-7.5">
          {/* 이름 */}
          <div className="flex flex-col gap-2.5">
            <label htmlFor="pname" className="text-ink-700 text-sm font-semibold">
              이름
            </label>
            <input
              id="pname"
              required
              aria-required="true"
              placeholder="성함을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-line bg-card text-ink-900 placeholder:text-ink-400 focus-visible:border-primary focus-visible:ring-ring/30 h-14 rounded-md border px-4.5 text-base transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          {/* 성별 */}
          <div className="flex flex-col gap-2.5">
            <span className="text-ink-700 text-sm font-semibold">성별</span>
            <GenderSegmented value={gender} onChange={setGender} />
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-2.5">
            <span className="text-ink-700 text-sm font-semibold">생년월일</span>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              aria-label={birth ? `생년월일: ${birthLabel}` : '생년월일 선택'}
              aria-haspopup="dialog"
              aria-expanded={pickerOpen}
              className={`bg-card focus-visible:ring-ring/30 flex h-14 items-center rounded-md border px-4.5 text-left text-base transition-[border-color,background-color] focus-visible:ring-2 focus-visible:outline-none ${
                pickerOpen
                  ? 'border-primary bg-secondary'
                  : 'border-line hover:border-primary hover:bg-secondary'
              } ${birth ? 'text-ink-900 tabular-nums' : 'text-ink-400'}`}
            >
              {birthLabel}
              <Calendar
                className={`ml-auto size-5 shrink-0 ${pickerOpen ? 'text-primary' : 'text-ink-400'}`}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* 휴대폰 번호 */}
          <div className="flex flex-col gap-2.5">
            <label htmlFor="pphone" className="text-ink-700 text-sm font-semibold">
              휴대폰 번호
            </label>
            <div className="flex gap-2.5">
              <input
                id="pphone"
                required
                aria-required="true"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="border-line bg-card text-ink-900 placeholder:text-ink-400 focus-visible:border-primary focus-visible:ring-ring/30 h-14 min-w-0 flex-1 rounded-md border px-4.5 text-base tabular-nums transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:outline-none"
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={!phoneOk || pending}
                aria-busy={pending}
                className={`focus-visible:ring-primary h-14 flex-none rounded-md px-4.5 text-sm font-bold whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed ${
                  phoneOk && !pending
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-ink-500'
                }`}
              >
                인증번호 받기
              </button>
            </div>
          </div>

          {/* 인증번호 */}
          <div aria-live="polite" aria-atomic="true">
            {codePhase !== 'idle' && (
              <div className="flex flex-col gap-2.5">
                <label htmlFor="pcode" className="text-ink-700 text-sm font-semibold">
                  인증번호
                </label>
                <div
                  className={`bg-card focus-within:ring-ring/30 flex h-14 items-center rounded-md border px-4.5 transition-[border-color,box-shadow] duration-150 focus-within:ring-2 ${
                    codePhase === 'error'
                      ? 'border-destructive ring-destructive focus-within:ring-destructive/40 ring-1'
                      : codePhase === 'filled'
                        ? 'border-status-done'
                        : 'border-line focus-within:border-primary'
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
                    id="pcode"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    aria-invalid={codePhase === 'error'}
                    aria-describedby={codePhase === 'error' ? 'code-error' : undefined}
                    placeholder="인증번호를 입력해주세요"
                    value={code}
                    onCompositionStart={() => {
                      composing.current = true;
                    }}
                    onCompositionEnd={(e) => {
                      composing.current = false;
                      onCodeChange(e.currentTarget.value);
                    }}
                    onChange={(e) => {
                      if (!composing.current) onCodeChange(e.target.value);
                    }}
                    className="text-ink-900 placeholder:text-ink-400 min-w-0 flex-1 bg-transparent text-base tabular-nums focus:outline-none"
                  />
                  {codePhase === 'filled' ? (
                    <CircleCheck
                      className="text-status-done ml-auto size-4.5 shrink-0"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  ) : (
                    <CountdownTimer
                      key={timerKey}
                      startedAt={startedAt!}
                      ttl={CODE_TTL}
                      isError={codePhase === 'error'}
                      onAlert={setTimerAlert}
                    />
                  )}
                </div>

                {codePhase === 'error' && (
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
                    {codeErrorMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={sendCode}
                  disabled={pending}
                  aria-busy={pending}
                  className="bg-surface text-primary border-line hover:bg-secondary focus-visible:ring-primary mt-3.5 flex h-14 w-full items-center justify-center gap-2 rounded-md border text-base font-bold whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <RefreshCw className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
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

      <BirthPickerDrawer
        key={pickerOpen ? 'open' : 'closed'}
        open={pickerOpen}
        value={birth}
        onClose={() => setPickerOpen(false)}
        onConfirm={(v) => {
          setBirth(v);
          setPickerOpen(false);
        }}
      />
    </>
  );
}
