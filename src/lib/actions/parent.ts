'use server';

import { mealTimeSchema } from '@/lib/schema/mealTime';
import { parentSchema } from '@/lib/schema/parent';
import { cookies } from 'next/headers';

export async function requestParentCode(phoneRaw: string) {
  const phone = phoneRaw.replace(/\D/g, '');
  return { ok: true as const, phone };
}

export async function verifyParentCode(phoneRaw: string, code: string): Promise<boolean> {
  const phone = phoneRaw.replace(/\D/g, '');
  return phone.length === 11 && code === '111111';
}

export async function registerParent(input: unknown) {
  const data = parentSchema.parse(input);
  (await cookies()).set('ongil_registering_parent', data.phone, {
    httpOnly: true,
    path: '/',
  });
}

export async function saveMealTimes(input: unknown) {
  const data = mealTimeSchema.parse(input);
  void data;
  return { ok: true as const };
}
