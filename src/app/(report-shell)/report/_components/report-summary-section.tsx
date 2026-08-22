import { getReportSummary } from '@/lib/data/report';
import { ReportEmptyState } from './report-empty-state';
import { ReportInfoCard } from './report-info-card';
import { ReportInteractionSection } from './report-interaction-section';
import { ReportMedicationLink } from './report-medication-link';
import { ReportPdfButton } from './report-pdf-button';

interface ReportSummarySectionProps {
  seniorId: number;
}

export async function ReportSummarySection({ seniorId }: ReportSummarySectionProps) {
  const summary = await getReportSummary(seniorId);
  const medicationCount = summary.hospitals.reduce(
    (sum, hospital) => sum + hospital.medications.length,
    0,
  );

  if (medicationCount === 0) {
    return <ReportEmptyState />;
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-(--report-cta-clearance)">
      <ReportInfoCard patient={summary.patient} />
      <ReportMedicationLink count={medicationCount} />
      <ReportInteractionSection interactions={summary.interactions} />
      <ReportPdfButton />
    </div>
  );
}
