import { ReportField } from '@/components/report-field';
import { MED_COLOR_CLASSES } from '@/lib/constants/med-colors';
import type { ReportMedication, ReportMedicationStatus } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { Pill } from 'lucide-react';

const STATUS_BADGE: Record<ReportMedicationStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-status-active-bg', text: 'text-status-active', label: '복용 중' },
  completed: { bg: 'bg-status-done-bg', text: 'text-status-done', label: '복용 완료' },
};

interface ReportMedicationItemProps {
  medication: ReportMedication;
}

export function ReportMedicationItem({ medication }: ReportMedicationItemProps) {
  const color = MED_COLOR_CLASSES[medication.color];
  const badge = STATUS_BADGE[medication.status];
  const { startDate, endDate } = medication.dosagePeriod;

  return (
    <div className="shadow-card bg-card rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl',
            color.iconBg,
          )}
          aria-hidden
        >
          <Pill size={22} className={color.iconColor} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-foreground truncate text-base font-semibold">
              {medication.name}
            </span>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                badge.bg,
                badge.text,
              )}
            >
              {badge.label}
            </span>
          </div>
          <span className="text-ink-500 text-sm">{medication.kind}</span>
        </div>
      </div>

      <div className="border-line mt-3 grid grid-cols-2 gap-2 border-t pt-3">
        <ReportField label="처방기관" value={medication.hospitalName ?? '-'} />
        <ReportField label="투약기간" value={`${startDate} ~ ${endDate}`} />
      </div>
      <div className="mt-2">
        <ReportField label="총 투여일수" value={`${medication.totalDays}일`} />
      </div>
    </div>
  );
}
