'use client';

import { cn } from '@/lib/utils';
import { CircleCheck, Hospital, Pill } from 'lucide-react';
import { useState } from 'react';

type MedColor = 'blue' | 'purple' | 'orange';
type MealType = 'morning' | 'noon' | 'night';

interface Medication {
  id: string;
  name: string;
  kind?: string;
  use: string[];
  color: MedColor;
}

interface HospitalGroup {
  id?: string;
  hospital?: string;
  medications: Medication[];
}

interface MealGroup {
  mealname: string;
  mealType: MealType;
  time: string;
  dateTime: string;
  hospitals: HospitalGroup[];
}

const MED_COLOR: Record<MedColor, { bg: string; text: string }> = {
  blue: { bg: 'bg-med-blue-bg', text: 'text-med-blue' },
  purple: { bg: 'bg-med-purple-bg', text: 'text-med-purple' },
  orange: { bg: 'bg-med-orange-bg', text: 'text-med-orange' },
};

const MEAL_COLOR: Record<MealType, { text: string; dot: string }> = {
  morning: { text: 'text-meal-morning', dot: 'bg-meal-morning' },
  noon: { text: 'text-meal-noon', dot: 'bg-meal-noon' },
  night: { text: 'text-meal-night', dot: 'bg-meal-night' },
};

const MEAL_DATA: MealGroup[] = [
  {
    mealname: '아침',
    mealType: 'morning',
    time: '오전 08:30',
    dateTime: '2026-06-13T08:30',
    hospitals: [
      {
        id: 'seoul-hospital',
        hospital: '서울병원',
        medications: [
          {
            id: 'aspirin',
            name: '아스피린',
            kind: '소화제',
            use: ['1일 3회', '1회 1정', '7일 복용'],
            color: 'blue',
          },
          {
            id: 'stomach',
            name: '위장약',
            use: ['1일 3회', '식후 30분'],
            color: 'blue',
          },
        ],
      },
      {
        id: 'self',
        medications: [
          {
            id: 'vitamin',
            name: '비타민',
            use: ['1일 1회'],
            color: 'purple',
          },
        ],
      },
    ],
  },
  {
    mealname: '점심',
    mealType: 'noon',
    time: '오후 12:30',
    dateTime: '2026-06-13T12:30',
    hospitals: [
      {
        id: 'seoul-hospital',
        hospital: '서울병원',
        medications: [
          {
            id: 'antibiotic',
            name: '항생제',
            kind: '감기약',
            use: ['1일 2회', '1회 1정', '5일 복용'],
            color: 'orange',
          },
          {
            id: 'cough',
            name: '기침약',
            kind: '감기약',
            use: ['1일 2회', '1회 1정', '5일 복용'],
            color: 'orange',
          },
        ],
      },
    ],
  },
  {
    mealname: '저녁',
    mealType: 'night',
    time: '오후 06:30',
    dateTime: '2026-06-13T18:30',
    hospitals: [
      {
        id: 'seoul-hospital',
        hospital: '서울병원',
        medications: [
          {
            id: 'painkiller',
            name: '진통제',
            kind: '두통약',
            use: ['1일 2회', '1회 1정', '3일 복용'],
            color: 'purple',
          },
          {
            id: 'sleeping',
            name: '수면제',
            kind: '수면 보조제',
            use: ['1일 1회', '취침 30분 전'],
            color: 'purple',
          },
        ],
      },
      {
        id: 'self',
        medications: [
          {
            id: 'probiotic',
            name: '프로바이오틱스',
            kind: '유산균',
            use: ['1일 1회', '식후 30분'],
            color: 'blue',
          },
        ],
      },
    ],
  },
];

export default function MediCard() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {MEAL_DATA.map((meal) => {
        const headingId = `meal-heading-${meal.mealname}`;
        const mealColor = MEAL_COLOR[meal.mealType];

        return (
          <section
            key={meal.mealname}
            aria-labelledby={headingId}
            className="bg-card shadow-card overflow-hidden rounded-xl"
          >
            {/* 식사시간 헤더 */}
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

            {/* 병원별 그룹 */}
            <div className="flex flex-col gap-3 p-4">
              {meal.hospitals.map((group, groupIdx) => (
                <div
                  key={group.id ?? group.hospital ?? `group-${groupIdx}`}
                  className="border-line overflow-hidden rounded-xl border"
                >
                  {/* 병원 헤더 (병원명 있을 때만) */}
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

                  {/* 약품 목록 */}
                  <ul className="divide-line divide-y">
                    {group.medications.map((med) => {
                      const isChecked = checkedIds.has(med.id);
                      const colorCls = MED_COLOR[med.color];

                      return (
                        <li
                          key={med.id}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3.5 transition-colors duration-150',
                            isChecked && 'bg-status-active-bg',
                          )}
                        >
                          {/* 약품 아이콘 (데코레이티브) */}
                          <div
                            aria-hidden="true"
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                              colorCls.bg,
                            )}
                          >
                            <Pill strokeWidth={1.9} className={cn('h-5 w-5', colorCls.text)} />
                          </div>

                          {/* 약품 정보 */}
                          <div className="flex flex-1 flex-col gap-1">
                            <span
                              className={cn(
                                'text-foreground text-base font-semibold transition-colors duration-150',
                                isChecked && 'text-muted-foreground line-through',
                              )}
                            >
                              {med.name}
                            </span>
                            {med.kind && (
                              <span
                                className={cn(
                                  'text-muted-foreground text-sm transition-colors duration-150',
                                  isChecked && 'line-through',
                                )}
                              >
                                {med.kind}
                              </span>
                            )}
                            <div className="flex flex-wrap gap-1.5">
                              {med.use.map((u) => (
                                <span
                                  key={u}
                                  className="border-line text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
                                >
                                  {u}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 복용 체크 버튼 */}
                          <button
                            type="button"
                            aria-pressed={isChecked}
                            aria-label={`${med.name} 복용 확인`}
                            onClick={() => toggleChecked(med.id)}
                            className="focus-visible:ring-primary -m-2.5 shrink-0 p-2.5 focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                          >
                            <CircleCheck
                              aria-hidden="true"
                              className={cn(
                                'h-6 w-6',
                                isChecked ? 'fill-primary text-blue-50' : 'text-primary fill-none',
                              )}
                            />
                          </button>
                        </li>
                      );
                    })}
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
