import { getMarkedDates } from '@/lib/data/home';
import { getWeekISOs } from '@/lib/date';
import { WeekStripController } from './week-strip-controller';

interface WeekStripSectionProps {
  anchorISO: string;
  selectedISO: string;
  patientId: number;
}

export async function WeekStripSection({
  anchorISO,
  selectedISO,
  patientId,
}: WeekStripSectionProps) {
  const weekISOs = getWeekISOs(anchorISO);
  const markedISO = await getMarkedDates(patientId, weekISOs);

  return (
    <WeekStripController anchorISO={anchorISO} selectedISO={selectedISO} markedISO={markedISO} />
  );
}
