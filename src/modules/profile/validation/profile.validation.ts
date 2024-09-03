import { z } from 'zod';

import { GenderEnum } from '@/configs';
import { getBirthdayField } from '@/validations';

export const profileUpdateFormSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(8).max(15),
  gender: z.nativeEnum(GenderEnum, { message: 'Invalid gender' }),
  dob: getBirthdayField(),
  address: z.string().trim().min(1).max(255),
  avatar: z.instanceof(File).optional().or(z.string().optional()),
  bankAccount: z
    .string()
    .max(30, { message: 'Invalid bank account number' })
    .refine((val) => /^[0-9]+$/.test(val), { message: 'Invalid bank account number' }),
  bankAccountName: z.string().min(1).max(100),
});

export type ProfileUpdateFormType = z.infer<typeof profileUpdateFormSchema>;
