import { z } from 'zod';

import { regexEmail } from '@/validations';

export const loginValidationSchema = (t: any) =>
  z.object({
    email: z
      .string({
        invalid_type_error: t('validation.emailRequired'),
        required_error: t('validation.emailRequired'),
      })
      .regex(regexEmail, t('validation.emailInvalid')),
    password: z
      .string()
      .trim()
      .min(6, { message: t('validation.passwordMin') })
      .max(255, { message: t('validation.passwordMax') }),
  });

export type LoginValidationSchemaType = z.infer<ReturnType<typeof loginValidationSchema>>;
