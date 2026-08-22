import { getReportSummary, REPORT_METHOD_NOTE } from '@/lib/data/report';
import { ReportMedicationItem } from './report-medication-item';

interface ReportMedicationsListProps {
  seniorId: number;
}

export async function ReportMedicationsList({ seniorId }: ReportMedicationsListProps) {
  const summary = await getReportSummary(seniorId);
  const medications = summary.hospitals.flatMap((hospital) => hospital.medications);

  return (
    <>
      <p className="kr-wrap text-ink-500 px-1 text-sm leading-relaxed">{REPORT_METHOD_NOTE}</p>
      {medications.map((medication) => (
        <ReportMedicationItem key={medication.id} medication={medication} />
      ))}
    </>
  );
}
