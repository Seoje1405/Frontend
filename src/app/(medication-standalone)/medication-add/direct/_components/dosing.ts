import dayjs from 'dayjs';
import type { DosingTime } from './types';

export function getAutoDosingTimes(frequency: 1 | 2 | 3 | null): DosingTime[] {
  switch (frequency) {
    case 1:
      return ['noon'];
    case 2:
      return ['morning', 'noon'];
    case 3:
      return ['morning', 'noon', 'night'];
    default:
      return [];
  }
}

// OCR/재등록이 인식한 하루 복용 횟수를 폼이 다루는 1~3 범위로 정규화(범위 밖이면 미지정 처리)
export function normalizeFrequency(timesPerDay: number | null): 1 | 2 | 3 | null {
  return timesPerDay !== null && timesPerDay >= 1 && timesPerDay <= 3
    ? (timesPerDay as 1 | 2 | 3)
    : null;
}

// 복용 시작~종료일을 백엔드가 받는 총 복용일수로 변환(당일 포함 계산)
export function toTotalDays(start: Date | null, end: Date | null): number | null {
  if (!start || !end) return null;
  const diff = dayjs(end).diff(dayjs(start), 'day') + 1;
  return diff > 0 ? diff : null;
}
