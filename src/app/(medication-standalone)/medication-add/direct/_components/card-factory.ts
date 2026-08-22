import { getAutoDosingTimes } from './dosing';
import type { MedicationCard } from './types';

export function createCard(override: Partial<MedicationCard> = {}): MedicationCard {
  return {
    id: crypto.randomUUID(),
    nickname: '',
    medicationName: '',
    frequency: null,
    dosagePerOnce: '',
    dosingTimes: [],
    memo: '',
    autoMemo: '',
    startDate: null,
    endDate: null,
    ...override,
  };
}

// 복용 횟수↔복용 시기 양방향 동기화(한쪽을 바꾸면 다른 쪽을 자동 반영) — 생성 폼과 수정 폼이 공유
export function applyCardChange(
  card: MedicationCard,
  payload: Partial<MedicationCard>,
): MedicationCard {
  const updated = { ...card, ...payload };
  if ('frequency' in payload) {
    updated.dosingTimes = getAutoDosingTimes(updated.frequency);
  } else if ('dosingTimes' in payload) {
    const count = updated.dosingTimes.length;
    updated.frequency = count >= 1 && count <= 3 ? (count as 1 | 2 | 3) : null;
  }
  return updated;
}
