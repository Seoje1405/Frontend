import { cookies } from 'next/headers';
import {
  ACCESS_TOKEN_COOKIE,
  MEAL_TIMES_COOKIE,
  SENIOR_BIRTHDATE_COOKIE,
  SENIOR_ID_COOKIE,
  SENIOR_NAME_COOKIE,
} from './constants';

export type SessionMealTimes = { morning: string; noon: string; night: string }; // 'HH:mm'

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// refreshToken은 저장하지 않음 — 만료 시 재로그인 유도 (백엔드에 refresh API 생기면 재검토)
export async function setAccessToken(accessToken: string, expiresIn: number): Promise<void> {
  (await cookies()).set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: expiresIn,
  });
}

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

// GET /api/seniors(목록/상세 조회)가 없어 등록 응답의 seniorId를 세션에 저장해 재사용
export async function setSeniorId(seniorId: number): Promise<void> {
  (await cookies()).set(SENIOR_ID_COOKIE, String(seniorId), SESSION_COOKIE_OPTIONS);
}

export async function getSeniorId(): Promise<number | undefined> {
  const value = (await cookies()).get(SENIOR_ID_COOKIE)?.value;
  return value ? Number(value) : undefined;
}

// GET /api/seniors(조회)가 없어 등록 시점의 이름을 세션에 저장해 재사용(홈 화면 인사말 등)
export async function setSeniorName(name: string): Promise<void> {
  (await cookies()).set(SENIOR_NAME_COOKIE, name, SESSION_COOKIE_OPTIONS);
}

export async function getSeniorName(): Promise<string | undefined> {
  return (await cookies()).get(SENIOR_NAME_COOKIE)?.value;
}

// GET /api/seniors(조회)가 없어 등록 시점의 생년월일을 세션에 보관해 재사용(리포트 나이 계산 등)
export async function setSeniorBirthDate(birthDate: string): Promise<void> {
  (await cookies()).set(SENIOR_BIRTHDATE_COOKIE, birthDate, SESSION_COOKIE_OPTIONS);
}

export async function getSeniorBirthDate(): Promise<string | undefined> {
  return (await cookies()).get(SENIOR_BIRTHDATE_COOKIE)?.value;
}

// PATCH /api/seniors/{id}/meal-time는 조회를 지원하지 않아 저장 시점의 값을 세션에 함께 보관해 재사용(홈 화면 식사시간 표시)
export async function setMealTimes(mealTimes: SessionMealTimes): Promise<void> {
  (await cookies()).set(MEAL_TIMES_COOKIE, JSON.stringify(mealTimes), SESSION_COOKIE_OPTIONS);
}

export async function getMealTimes(): Promise<SessionMealTimes | undefined> {
  const value = (await cookies()).get(MEAL_TIMES_COOKIE)?.value;
  if (!value) return undefined;
  try {
    return JSON.parse(value) as SessionMealTimes;
  } catch {
    return undefined;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getAccessToken());
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(SENIOR_ID_COOKIE);
  store.delete(SENIOR_NAME_COOKIE);
  store.delete(SENIOR_BIRTHDATE_COOKIE);
  store.delete(MEAL_TIMES_COOKIE);
}
