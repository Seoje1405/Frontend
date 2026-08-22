'use server';

import { ApiError, apiClient } from '@/lib/api/client';
import { getSeniorId, isAuthenticated } from '@/lib/auth/session';
import {
  medicationRegisterSchema,
  medicationUpdateSchema,
  type MedicationRegisterInput,
  type MedicationUpdateInput,
} from '@/lib/schema/medication';
import type {
  MealTime,
  MedicationCreateRequest,
  MedicationLogToggleRequest,
  MedicationLogToggleResponse,
  MedicationResponse,
  MedicationUpdateRequest,
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

type UpdateResult = { ok: true } | { ok: false; error: string };

export async function updateMedication(
  medicationId: number,
  input: MedicationUpdateInput,
): Promise<UpdateResult> {
  const parsed = medicationUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? '입력값을 확인해주세요.' };
  }

  // Server Action은 API 라우트와 동일하게 공개 엔드포인트로 취급 — 페이지 가드와 별개로 액션 내부에서도 세션 검증
  if (!(await isAuthenticated())) {
    return { ok: false, error: '로그인이 필요합니다.' };
  }

  // 등록 흐름과 동일하게 별명(nickname)을 약 이름 앞에 붙여 보존(백엔드에 별도 필드 없음)
  const request: MedicationUpdateRequest = {
    drugName: parsed.data.nickname.trim()
      ? `[${parsed.data.nickname.trim()}] ${parsed.data.medicationName}`
      : parsed.data.medicationName,
    dosagePerTime: parsed.data.dosagePerOnce || null,
    timesPerDay: parsed.data.dosingTimesCount,
    totalDays: parsed.data.totalDays,
    startDate: parsed.data.startDate,
    hospitalName: parsed.data.hospitalName || null,
    memo: parsed.data.memo || null,
  };

  try {
    await apiClient.patch(`/api/medications/${medicationId}`, request);
    revalidatePath('/home');
    revalidatePath('/note');
    revalidatePath(`/note/${medicationId}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}

type DeleteResult = { ok: true } | { ok: false; error: string };

export async function deleteMedication(medicationId: number): Promise<DeleteResult> {
  // Server Action은 API 라우트와 동일하게 공개 엔드포인트로 취급 — 페이지 가드와 별개로 액션 내부에서도 세션 검증
  if (!(await isAuthenticated())) {
    return { ok: false, error: '로그인이 필요합니다.' };
  }

  try {
    await apiClient.delete(`/api/medications/${medicationId}`);
    revalidatePath('/home');
    revalidatePath('/note');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}
