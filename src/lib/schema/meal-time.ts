import { z } from 'zod';

const KO_TIME_RE = /^(오전|오후)\s+\d{1,2}:\d{2}$/;

const timeString = z.string().regex(KO_TIME_RE, '올바른 시간 형식이 아닙니다.');

export const mealTimeSchema = z.object({
  morning: timeString,
  noon: timeString,
  night: timeString,
});

export type MealTimeInput = z.infer<typeof mealTimeSchema>;

// "오전 8:00" / "오후 6:00" → 백엔드 요구 형식 "HH:mm"(24시간제)로 변환
export function toHHmm(koTime: string): string {
  const match = koTime.match(/^(오전|오후)\s+(\d{1,2}):(\d{2})$/);
  if (!match) {
    throw new Error('올바른 시간 형식이 아닙니다.');
  }

  const [, ampm, hourStr, minute] = match;
  let hour = Number(hourStr);
  if (ampm === '오후' && hour !== 12) hour += 12;
  if (ampm === '오전' && hour === 12) hour = 0;

  return `${String(hour).padStart(2, '0')}:${minute}`;
}

// "HH:mm"(24시간제) → "오전 8:00" / "오후 6:00" — toHHmm()의 역변환, 홈 화면 표시용
export function fromHHmm(hhmm: string): string {
  const [hourStr, minute] = hhmm.split(':');
  const hour24 = Number(hourStr);
  const ampm = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${ampm} ${hour12}:${minute}`;
}
