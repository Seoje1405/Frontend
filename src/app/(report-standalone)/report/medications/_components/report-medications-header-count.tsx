import { getReportSummary } from '@/lib/data/report';

interface ReportMedicationsHeaderCountProps {
  seniorId: number;
}

export async function ReportMedicationsHeaderCount({
  seniorId,
}: ReportMedicationsHeaderCountProps) {
  const summary = await getReportSummary(seniorId);
  const medicationCount = summary.hospitals.reduce(
    (sum, hospital) => sum + hospital.medications.length,
    0,
  );

  return (
    <h1 className="text-foreground text-xl font-semibold">사용중인 약물 {medicationCount}건</h1>
  );
}
