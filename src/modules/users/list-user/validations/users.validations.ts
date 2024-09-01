import { z } from 'zod';

import { GenderEnum, REGEX_PASSWORD, UserStatusEnum } from '@/configs';
import { getBirthdayField } from '@/validations';

export const userFormSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  userName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().min(1).max(255),
  password: z
    .string()
    .trim()
    .min(6)
    .max(255)
    .regex(
      REGEX_PASSWORD,
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character'
    ),
  phone: z.string().trim().min(8).max(15),
  gender: z.nativeEnum(GenderEnum, { message: 'Invalid gender' }),
  dob: getBirthdayField(),
  status: z.nativeEnum(UserStatusEnum, { message: 'Invalid status' }).optional(),
  address: z.string().trim().min(1).max(255),
  roleId: z.string().trim().min(1),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
