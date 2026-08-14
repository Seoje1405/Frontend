import type { MedColor } from '@/lib/data/types';

// 백엔드가 약 색상 태그를 내려주지 않아, medicationId 기반 결정적 해시로 배정(의학적 의미 없는 식별용 색상)
const MED_COLOR_ORDER: MedColor[] = ['blue', 'purple', 'orange'];

export function hashMedColor(medicationId: number): MedColor {
  return MED_COLOR_ORDER[medicationId % MED_COLOR_ORDER.length];
}

export const MED_COLOR_CLASSES: Record<
  MedColor,
  { iconBg: string; iconColor: string; chipBg: string; chipText: string }
> = {
  blue: {
    iconBg: 'bg-med-blue-bg',
    iconColor: 'text-med-blue',
    chipBg: 'bg-med-blue-bg',
    chipText: 'text-med-blue',
  },
  purple: {
    iconBg: 'bg-med-purple-bg',
    iconColor: 'text-med-purple',
    chipBg: 'bg-med-purple-bg',
    chipText: 'text-med-purple',
  },
  orange: {
    iconBg: 'bg-med-orange-bg',
    iconColor: 'text-med-orange',
    chipBg: 'bg-med-orange-bg',
    chipText: 'text-med-orange',
  },
};
