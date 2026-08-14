import { getMealData } from '@/lib/data/home';
import MediCard from './medi-card';

interface MediCardSectionProps {
  patientId: number;
  date: string;
}

export async function MediCardSection({ patientId, date }: MediCardSectionProps) {
  const data = await getMealData(patientId, date);

  return (
    <div className="px-4 pb-8">
      <MediCard data={data} />
    </div>
  );
}
