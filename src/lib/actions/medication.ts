'use server';

import { ApiError, apiClient } from '@/lib/api/client';
import type {
  MealTime,
  MedicationLogToggleRequest,
  MedicationLogToggleResponse,
} from '@/types/api';
import { revalidatePath } from 'next/cache';

type ToggleResult = { ok: true; isTaken: boolean } | { ok: false; error: string };

// 백엔드는 "설정"이 아니라 "반전(toggle)"만 지원 — 응답의 isTaken을 신뢰 소스로 사용해야 함
export async function checkMedication(
  medicationId: number,
  mealTime: MealTime,
): Promise<ToggleResult> {
  try {
    const result = await apiClient.post<MedicationLogToggleResponse>(
      `/api/home/medications/${medicationId}/logs/toggle`,
      { mealTime } satisfies MedicationLogToggleRequest,
    );

    revalidatePath('/home');
    return { ok: true, isTaken: result.isTaken };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}
