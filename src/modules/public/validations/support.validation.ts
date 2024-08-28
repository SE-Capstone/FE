import { z } from 'zod';

import { regexPhone } from '@/validations';

export const SupportSchemaValidator = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number phải có ít nhất 10 ký tự')
    .regex(regexPhone, 'Phone number không hợp lệ'),
  // email: z.string().min(1, 'Email không được để trống').regex(regexEmail, 'Email không hợp lệ'),
  message: z.string().min(1, 'Nội dung không được để trống'),
  subject: z
    .string()
    .min(1, 'Chủ đề không được để trống')
    .max(100, 'Chủ đề không được quá 100 ký tự'),
});

export type SupportPayload = z.infer<typeof SupportSchemaValidator>;
