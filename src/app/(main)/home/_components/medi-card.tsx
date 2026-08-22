import type { MealGroup, MealType } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { Hospital } from 'lucide-react';
import { EmptyMediCardCta } from './empty-medi-card-cta';
import { MediCardItem } from './medi-card-item';

const MEAL_COLOR: Record<MealType, { text: string; dot: string }> = {
  morning: { text: 'text-meal-morning', dot: 'bg-meal-morning' },
  noon: { text: 'text-meal-noon', dot: 'bg-meal-noon' },
  night: { text: 'text-meal-night', dot: 'bg-meal-night' },
};

interface MediCardProps {
  data: MealGroup[];
}

export default function MediCard({ data }: MediCardProps) {
  if (data.length === 0) {
    return (
      <div className="shadow-card bg-card flex flex-col items-center gap-6 rounded-xl px-6 py-16">
        <p className="kr-wrap text-foreground text-center text-2xl font-bold">
          오늘 먹을 약이 없네요
        </p>
        <EmptyMediCardCta />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((meal) => {
        const headingId = `meal-heading-${meal.mealType}`;
        const mealColor = MEAL_COLOR[meal.mealType];

        return (
          <section
            key={meal.mealname}
            aria-labelledby={headingId}
            className="bg-card shadow-card overflow-hidden rounded-xl"
          >
            <div className="border-line flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className={cn('size-2 rounded-full', mealColor.dot)} />
                <h2 id={headingId} className={cn('text-sm font-semibold', mealColor.text)}>
                  {meal.mealname}
                </h2>
              </div>
              <time dateTime={meal.dateTime} className="text-muted-foreground text-sm">
                {meal.time}
              </time>
            </div>

            <div className="flex flex-col gap-3 p-4">
              {meal.hospitals.map((group, groupIdx) => (
                <div
                  key={group.id ?? group.hospital ?? `group-${groupIdx}`}
                  className="border-line overflow-hidden rounded-xl border"
                >
                  {group.hospital && (
                    <div className="border-line flex items-center gap-2 border-b px-4 py-3">
                      <div className="bg-med-blue-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                        <Hospital
                          aria-hidden="true"
                          strokeWidth={1.9}
                          className="text-med-blue h-4 w-4"
                        />
                      </div>
                      <span className="text-foreground text-xl font-semibold">
                        {group.hospital}
                      </span>
                    </div>
                  )}

                  <ul className="divide-line divide-y">
                    {group.medications.map((med) => (
                      <MediCardItem key={med.id} med={med} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
