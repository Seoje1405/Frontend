import { getCurrentCards } from '@/lib/data/home';
import HomeCurrentCard from './home-current-card';

interface CurrentCardSectionProps {
  patientId: number;
  date: string;
}

export async function CurrentCardSection({ patientId, date }: CurrentCardSectionProps) {
  const cards = await getCurrentCards(patientId, date);

  return (
    <div className="flex flex-col gap-4 p-4">
      {cards.map(({ id, ...props }) => (
        <HomeCurrentCard key={id} {...props} />
      ))}
    </div>
  );
}
