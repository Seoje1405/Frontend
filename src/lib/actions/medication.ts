'use server';

import { ApiError, apiClient } from '@/lib/api/client';
import { getSeniorId } from '@/lib/auth/session';
import { medicationRegisterSchema, type MedicationRegisterInput } from '@/lib/schema/medication';
import type {
  MealTime,
  MedicationCreateRequest,
  MedicationLogToggleRequest,
  MedicationLogToggleResponse,
  MedicationResponse,
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

type RegisterResult =
  | { ok: true; medications: MedicationResponse[] }
  | { ok: false; error: string };

// 여러 약 카드를 한 번에 등록(배치 API — 하나라도 실패하면 전체 롤백)
export async function registerMedications(input: MedicationRegisterInput): Promise<RegisterResult> {
  // 저비용 동기 검증을 먼저 수행해 형식이 잘못된 입력이면 세션 조회(await) 없이 바로 반환
  const parsed = medicationRegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? '입력값을 확인해주세요.' };
  }

  const seniorId = await getSeniorId();
  if (!seniorId) {
    return { ok: false, error: '등록된 부모님 정보가 없습니다.' };
  }

  // 백엔드에 별명(nickname) 전용 필드가 없어 약 이름 앞에 붙여 보존
  const requests: MedicationCreateRequest[] = parsed.data.cards.map((card) => ({
    seniorId,
    ocrResultId: parsed.data.ocrResultId,
    drugName: card.nickname.trim()
      ? `[${card.nickname.trim()}] ${card.medicationName}`
      : card.medicationName,
    dosagePerTime: card.dosagePerOnce || null,
    timesPerDay: card.dosingTimesCount,
    totalDays: card.totalDays,
    startDate: card.startDate,
    prescriptionDate: parsed.data.prescriptionDate,
    hospitalName: parsed.data.hospitalName || null,
    memo: card.memo || null,
  }));

  try {
    const medications = await apiClient.post<MedicationResponse[]>(
      '/api/medications/batch',
      requests,
    );
    revalidatePath('/home');
    revalidatePath('/note');
    return { ok: true, medications };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}
