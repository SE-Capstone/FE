import { z } from 'zod';

import { REGEX_PASSWORD } from '@/configs';

export const changePasswordSchema = (t: any) =>
  z
    .object({
      oldPassword: z.string().min(1, { message: t('validation.passwordMin') }),
      newPassword: z
        .string()
        .trim()
        .min(6, { message: t('validation.passwordMin') })
        .max(255, { message: t('validation.passwordMax') })
        .regex(REGEX_PASSWORD, t('validation.passwordComplexity')),
      confirmPassword: z
        .string()
        .trim()
        .min(6, { message: t('validation.passwordMin') })
        .max(255, { message: t('validation.passwordMax') })
        .regex(REGEX_PASSWORD, t('validation.passwordComplexity')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validation.passwordSame'),
      path: ['confirmPassword'],
    });

export type ChangePasswordFormType = z.infer<ReturnType<typeof changePasswordSchema>>;
