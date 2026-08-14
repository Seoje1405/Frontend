import { CallCareBar } from '@/components/send-card/call-care-bar';
import { REGISTERING_PARENT_PHONE_COOKIE } from '@/lib/auth/constants';
import { getSeniorName } from '@/lib/auth/session';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { SendCardFlow } from './_components/send-card-flow';

const DEFAULT_NAME = '부모님';
const DEFAULT_RELATION = '보호 대상';

export default async function SendCardPage() {
  const cookieStore = await cookies();
  const rawPhone = cookieStore.get(REGISTERING_PARENT_PHONE_COOKIE)?.value ?? '';
  const seniorName = await getSeniorName();

  const phone = rawPhone ? rawPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '010-0000-0000';

  const card = {
    name: seniorName ?? DEFAULT_NAME,
    relation: DEFAULT_RELATION,
    phone,
  };

  return (
    <div className="flex flex-1 flex-col">
      <CallCareBar back="/onboarding/step2" />
      <Suspense fallback={<div className="flex-1" aria-busy="true" aria-label="로딩 중" />}>
        <SendCardFlow card={card} />
      </Suspense>
    </div>
  );
}
