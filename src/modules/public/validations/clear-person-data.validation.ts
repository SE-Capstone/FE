import { z } from 'zod';

import { regexPhone } from '@/validations';

export const clearPersonDataSchema = z.object({
  firstName: z.string().min(1, 'Tên không được để trống'),
  lastName: z.string().min(1, 'Họ không được để trống'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number không được để trống')
    .regex(regexPhone, 'Phone number không hợp lệ'),
});

export type ClearPersonDataFormValues = z.infer<typeof clearPersonDataSchema>;
