import { TriangleAlert } from 'lucide-react';

interface ExpiryAlertCardProps {
  medicationName: string;
  daysLeft: number;
  totalDays: number;
}

export default function ExpiryAlertCard({
  medicationName,
  daysLeft,
  totalDays,
}: ExpiryAlertCardProps) {
  // 잔여일이 0 이하인 경우에도 카드가 표시되도록 하고, 진행률은 100%로 고정
  const consumedPercent = Math.min(((totalDays - daysLeft) / totalDays) * 100, 100);

  return (
    <article
      className="shadow-card border-danger/20 bg-danger-bg flex flex-col gap-3 rounded-xl border p-4"
      aria-label={`${medicationName} 잔여일 경고`}
    >
      <div className="flex items-center gap-1.5">
        <TriangleAlert size={16} className="text-danger shrink-0" aria-hidden="true" />
        <span className="text-danger text-sm font-medium">곧 끝나는 약이 있어요</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="kr-wrap text-ink-900 min-w-0 flex-1 pr-2 text-base">{medicationName}</span>
        <span className="text-danger shrink-0 text-base font-medium">{daysLeft}일 남음</span>
      </div>

      <div
        className="bg-danger/15 h-1.5 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={daysLeft}
        aria-valuemin={0}
        aria-valuemax={totalDays}
        aria-label={`${medicationName} 잔여일`}
        aria-valuetext={`${daysLeft}일 남음 (전체 ${totalDays}일 중)`}
      >
        <div className="bg-danger h-full rounded-full" style={{ width: `${consumedPercent}%` }} />
      </div>
    </article>
  );
}
