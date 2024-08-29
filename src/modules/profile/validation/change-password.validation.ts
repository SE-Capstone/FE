import { z } from 'zod';

import { REGEX_PASSWORD } from '@/configs';

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .trim()
      .min(6, 'Mật khẩu bao gồm ít nhất 6 ký tự')
      .max(255, 'Mật khẩu không được quá 255 ký tự')
      .regex(
        REGEX_PASSWORD,
        'Mật khẩu phải bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
      ),
    confirmPassword: z
      .string()
      .trim()
      .min(6, 'Mật khẩu bao gồm ít nhất 6 ký tự')
      .max(255, 'Mật khẩu không được quá 255 ký tự')
      .regex(
        REGEX_PASSWORD,
        'Mật khẩu phải bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
