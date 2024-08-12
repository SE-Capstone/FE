import { z } from 'zod';

import { regexEmail } from '@/validations';

export const loginValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Email không được để trống',
      required_error: 'Email không được để trống',
    })
    .regex(regexEmail, `Email không hợp lệ`),
  password: z
    .string({
      invalid_type_error: 'Mật khẩu không được để trống',
      required_error: 'Mật khẩu không được để trống',
    })
    .min(3, 'Mật khẩu phải có ít nhất 3 ký tự'),
});

export type LoginValidationSchemaType = z.infer<typeof loginValidationSchema>;
