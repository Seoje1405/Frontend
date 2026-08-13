'use server';

import { ApiError, apiClient } from '@/lib/api/client';
import { REGISTERING_PARENT_PHONE_COOKIE } from '@/lib/auth/constants';
import { getSeniorId, setMealTimes, setSeniorId, setSeniorName } from '@/lib/auth/session';
import { mealTimeSchema, toHHmm } from '@/lib/schema/meal-time';
import { parentSchema } from '@/lib/schema/parent';
import type {
  PhoneVerificationSendRequest,
  PhoneVerificationSendResponse,
  SeniorCreateRequest,
  SeniorMealTimeUpdateRequest,
  SeniorResponse,
} from '@/types/api';
import { cookies } from 'next/headers';

type ActionResult = { ok: true } | { ok: false; error: string };

// 백엔드에 별도 "검증" 엔드포인트가 없어 발송만 하고, 실제 검증은 registerParent(등록)에서 처리
// 문자 발송 기능이 아직 미구현이라 테스트 API가 인증번호를 응답으로 내려줌 → 클라이언트에서 자동 채움
export async function requestParentCode(
  phoneRaw: string,
): Promise<{ ok: true; verificationCode: string } | { ok: false; error: string }> {
  const phone = phoneRaw.replace(/\D/g, '');

  try {
    const { verificationCode } = await apiClient.post<PhoneVerificationSendResponse>(
      '/api/seniors/phone-verification',
      { phoneNumber: phone } satisfies PhoneVerificationSendRequest,
    );
    return { ok: true, verificationCode };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}

export async function registerParent(
  input: unknown,
): Promise<{ ok: true; seniorId: number } | { ok: false; error: string }> {
  const parsed = parentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? '입력값을 확인해주세요.' };
  }
  const data = parsed.data;

  try {
    const senior = await apiClient.post<SeniorResponse>('/api/seniors', {
      name: data.name,
      gender: data.gender === 'M' ? 'MALE' : 'FEMALE',
      birthDate: data.birth,
      phoneNumber: data.phone,
      verificationCode: data.verificationCode,
    } satisfies SeniorCreateRequest);

    await setSeniorId(senior.seniorId);
    await setSeniorName(senior.name);
    (await cookies()).set(REGISTERING_PARENT_PHONE_COOKIE, data.phone, {
      httpOnly: true,
      path: '/',
    });

    return { ok: true, seniorId: senior.seniorId };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}

export async function saveMealTimes(input: unknown): Promise<ActionResult> {
  const parsed = mealTimeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? '입력값을 확인해주세요.' };
  }

  const seniorId = await getSeniorId();
  if (!seniorId) {
    return { ok: false, error: '부모님 등록 정보를 찾을 수 없습니다. 처음부터 다시 시도해주세요.' };
  }

  const breakfastTime = toHHmm(parsed.data.morning);
  const lunchTime = toHHmm(parsed.data.noon);
  const dinnerTime = toHHmm(parsed.data.night);

  try {
    await apiClient.patch<SeniorResponse>(`/api/seniors/${seniorId}/meal-time`, {
      breakfastTime,
      lunchTime,
      dinnerTime,
    } satisfies SeniorMealTimeUpdateRequest);

    await setMealTimes({ morning: breakfastTime, noon: lunchTime, night: dinnerTime });
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}
