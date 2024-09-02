import { z } from 'zod';

import { REGEX_PASSWORD } from '@/configs';
import { regexEmail } from '@/validations';

export const loginValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Email is required',
      required_error: 'Email is required',
    })
    .regex(regexEmail, `Invalid email`),
  password: z
    .string()
    .trim()
    .min(6)
    .max(255)
    .regex(
      REGEX_PASSWORD,
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character'
    ),
});

export type LoginValidationSchemaType = z.infer<typeof loginValidationSchema>;
