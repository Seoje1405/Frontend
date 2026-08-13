import { CallCareBar } from '@/components/send-card/call-care-bar';
import { Suspense } from 'react';
import { ParentAddSendCardFlow } from './_components/parent-add-send-card-flow';

const MOCK_CARD = {
  name: '부모님',
  relation: '보호 대상',
  phone: '010-0000-0000',
};

export default function ParentAddSendCardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <CallCareBar back="/parents/add/step2" />
      <Suspense fallback={<div className="flex-1" aria-busy="true" aria-label="로딩 중" />}>
        <ParentAddSendCardFlow card={MOCK_CARD} />
      </Suspense>
    </div>
  );
}
