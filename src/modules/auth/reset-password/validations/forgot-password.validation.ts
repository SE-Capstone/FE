import { z } from 'zod';

import { regexEmail } from '@/validations';

export const forgotPasswordSchema = (t: any) =>
  z.object({
    email: z
      .string({
        invalid_type_error: t('validation.emailRequired'),
        required_error: t('validation.emailRequired'),
      })
      .regex(regexEmail, t('validation.emailInvalid')),
  });

export type ForgotPasswordSchemaType = z.infer<ReturnType<typeof forgotPasswordSchema>>;
