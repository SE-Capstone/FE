import { z } from 'zod';

import { REGEX_PASSWORD } from '@/configs';

export const adminChangePasswordSchema = (t: any) =>
  z
    .object({
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

export type AdminChangePasswordFormType = z.infer<ReturnType<typeof adminChangePasswordSchema>>;
