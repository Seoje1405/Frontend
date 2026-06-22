import { z } from 'zod';

const KO_TIME_RE = /^(오전|오후)\s+\d{1,2}:\d{2}$/;

const timeString = z.string().regex(KO_TIME_RE, '올바른 시간 형식이 아닙니다.');

export const mealTimeSchema = z.object({
  morning: timeString,
  noon: timeString,
  night: timeString,
});

export type MealTimeInput = z.infer<typeof mealTimeSchema>;
