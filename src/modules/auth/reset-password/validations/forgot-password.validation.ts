import { z } from 'zod';

import { regexEmail } from '@/validations';

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Email is required',
      required_error: 'Email is required',
    })
    .regex(regexEmail, `Invalid email`),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
