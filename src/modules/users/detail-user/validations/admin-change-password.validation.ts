import { z } from 'zod';

import { REGEX_PASSWORD } from '@/configs';

export const adminChangePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6)
      .max(255)
      .regex(
        REGEX_PASSWORD,
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character'
      ),
    confirmPassword: z
      .string()
      .trim()
      .min(6)
      .max(255)
      .regex(
        REGEX_PASSWORD,
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character'
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

export type AdminChangePasswordFormType = z.infer<typeof adminChangePasswordSchema>;
