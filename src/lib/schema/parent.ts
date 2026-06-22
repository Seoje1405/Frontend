import { z } from 'zod';

import { phoneSchema } from './phone';

export const parentSchema = z.object({
  name: z.string().trim().min(1, '성함을 입력해주세요.').max(20),
  gender: z.enum(['M', 'F']),
  birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '생년월일을 선택해주세요.'),
  phone: phoneSchema,
});

export type ParentInput = z.infer<typeof parentSchema>;
