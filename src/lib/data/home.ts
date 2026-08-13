import { apiClient } from '@/lib/api/client';
import { getMealTimes, getSeniorName } from '@/lib/auth/session';
import type { HomeCardResponse, MedicationDepletionResponse } from '@/types/api';
import { cache } from 'react';
import { deriveCurrentCard, toMealGroups } from './home-mapping';
import type { CurrentCardData, ExpiryAlertData, MealGroup } from './types';

// 백엔드가 "남은 복용일수 3일 이하"인 약만 반환하므로, 소진임박 카드의 진행률 바는
// 실제 총 복용일수 대신 이 고정창(3일)을 기준으로 계산한다
const EXPIRY_ALERT_WINDOW_DAYS = 3;

// 같은 (patientId, date)에 대한 CurrentCardSection/MediCardSection의 중복 호출을 한 요청 내에서 합침
const getHomeCard = cache(async (patientId: number, date: string): Promise<HomeCardResponse> => {
  const query = new URLSearchParams({ seniorId: String(patientId), date });
  return apiClient.get<HomeCardResponse>(`/api/home/cards?${query.toString()}`);
});

export const getCurrentCards = cache(
  async (patientId: number, date: string): Promise<CurrentCardData[]> => {
    const [home, patientName, mealTimes] = await Promise.all([
      getHomeCard(patientId, date),
      getSeniorName().then((name) => name ?? '부모님'),
      getMealTimes(),
    ]);

    return [{ id: String(patientId), ...deriveCurrentCard(home, patientName, mealTimes) }];
  },
);

export const getExpiryAlerts = cache(async (patientId: number): Promise<ExpiryAlertData[]> => {
  const query = new URLSearchParams({ seniorId: String(patientId) });
  const alerts = await apiClient.get<MedicationDepletionResponse[]>(
    `/api/home/depletion?${query.toString()}`,
  );

  return alerts.map((alert) => ({
    id: alert.medicationId,
    medicationName: alert.drugName,
    daysLeft: Math.max(alert.remainingDays, 0),
    totalDays: EXPIRY_ALERT_WINDOW_DAYS,
  }));
});

export const getMealData = cache(async (patientId: number, date: string): Promise<MealGroup[]> => {
  const [home, mealTimes] = await Promise.all([getHomeCard(patientId, date), getMealTimes()]);

  return toMealGroups(home.mealGroups, home.mode, home.date, mealTimes);
});

// 주간 캘린더 점 표시(markedDates) API는 백엔드에 없어 보류 — 빈 배열 유지
export const getMarkedDates = cache(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (patientId: number, weekISOs: readonly string[]): Promise<string[]> => {
    return [];
  },
);
