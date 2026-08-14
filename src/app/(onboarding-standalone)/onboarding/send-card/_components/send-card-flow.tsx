'use client';

import { ResendLine } from '@/components/send-card/resend-line';
import { SaveGuide } from '@/components/send-card/save-guide';
import { SendDoneDialog } from '@/components/send-card/send-done-dialog';
import { SendProgress } from '@/components/send-card/send-progress';
import { VCardPreview } from '@/components/send-card/v-card-preview';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const MODAL_SEND_DONE = 'send-done' as const;

type Phase = 'sending' | 'sent';

interface VCardData {
  name: string;
  relation: string;
  phone: string;
}

interface SendCardFlowProps {
  card: VCardData;
}

export function SendCardFlow({ card }: SendCardFlowProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>('sending');

  const modal = searchParams.get('modal');
  const sendDoneOpen = modal === MODAL_SEND_DONE;

  function clearModal() {
    router.replace(pathname);
  }

  const handleSendComplete = useCallback(() => {
    router.replace(`${pathname}?modal=${MODAL_SEND_DONE}`);
  }, [router, pathname]);

  function handleSendDoneClose() {
    clearModal();
    setPhase('sent');
  }

  function handleResend() {
    toast.success('재발송 완료', {
      description: '부모님 휴대폰을 확인해 주세요.',
    });
  }

  function handleGoHome() {
    router.push('/home');
  }

  const isSent = phase === 'sent';

  return (
    <>
      <div className="flex flex-1 flex-col px-5.5 pt-7.5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* 헤딩 영역 */}
        <div className="mb-6">
          <h1 className="text-ink-900 text-4xl font-bold">
            {isSent ? (
              <>
                부모님께
                <br />
                발송됐어요
              </>
            ) : (
              '인증이 완료되었습니다'
            )}
          </h1>
        </div>

        {/* vCard 미리보기 */}
        <VCardPreview card={card} className="mb-5" />

        {/* sending 단계: 진행바 */}
        {!isSent && (
          <div className="mb-4">
            <SendProgress onComplete={handleSendComplete} />
          </div>
        )}

        {/* sent 단계: 저장 안내 + 재발송 */}
        {isSent && (
          <>
            <p className="kr-wrap text-ink-700 mb-4 text-sm font-semibold">
              아래 안내를 따라 앱을 저장해 주세요.
            </p>
            <SaveGuide />
            <div className="mt-5">
              <ResendLine onResend={handleResend} />
            </div>
          </>
        )}

        {/* 스페이서 */}
        <div className="flex-1" />

        {/* 하단 CTA */}
        <button
          type="button"
          onClick={handleGoHome}
          disabled={!isSent}
          aria-busy={!isSent}
          className="bg-primary text-primary-foreground shadow-fab focus-visible:ring-primary mt-6 flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold transition-colors duration-150 hover:bg-blue-700 focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          다음
        </button>
      </div>

      <SendDoneDialog open={sendDoneOpen} onClose={handleSendDoneClose} />
    </>
  );
}
