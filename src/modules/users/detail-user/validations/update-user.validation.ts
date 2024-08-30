import { z } from 'zod';

import { GenderEnum, UserStatusEnum } from '@/configs';
import { getBirthdayField } from '@/validations';

export const updateUserFormSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(8).max(15),
  gender: z.nativeEnum(GenderEnum, { message: 'Invalid gender' }),
  dob: getBirthdayField().or(z.string()),
  address: z.string().trim().min(1).max(255),
  avatar: z.instanceof(File).optional().or(z.string().optional()),
  bankAccount: z
    .string()
    .max(30, { message: 'Invalid bank account number' })
    .refine((val) => /^[0-9]+$/.test(val), { message: 'Invalid bank account number' }),
  bankAccountName: z.string().min(1).max(100),
  status: z.nativeEnum(UserStatusEnum, { message: 'Invalid status' }).optional(),
  role: z.string().trim().min(1),
});

export type UpdateUserFormType = z.infer<typeof updateUserFormSchema>;
