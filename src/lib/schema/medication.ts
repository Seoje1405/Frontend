import { z } from 'zod';

const medicationCardSchema = z.object({
  nickname: z.string(),
  medicationName: z.string().trim().min(1, '약 이름을 입력해주세요.'),
  dosagePerOnce: z.string(),
  dosingTimesCount: z.number().int().min(1).max(3).nullable(),
  memo: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '복용 시작일을 선택해주세요.'),
  totalDays: z.number().int().positive().nullable(),
});

export const medicationRegisterSchema = z.object({
  hospitalName: z.string(),
  ocrResultId: z.number().int().positive().nullable(),
  prescriptionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  cards: z.array(medicationCardSchema).min(1, '등록할 약을 추가해주세요.'),
});

export type MedicationRegisterInput = z.infer<typeof medicationRegisterSchema>;
