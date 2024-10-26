import { z } from 'zod';

import { GenderEnum } from '@/configs';
import { getBirthdayField } from '@/validations';

export const profileUpdateFormSchema = (t: any) =>
  z.object({
    fullName: z
      .string()
      .trim()
      .min(1, { message: t('validation.profile.fullNameRequired') })
      .max(100, { message: t('validation.profile.fullNameMax') }),
    phone: z
      .string()
      .trim()
      .min(8, { message: t('validation.phoneMin') })
      .max(15, { message: t('validation.phoneMax') }),
    gender: z.nativeEnum(GenderEnum, { message: t('validation.profile.invalidGender') }),
    dob: getBirthdayField(t),
    address: z
      .string()
      .trim()
      .min(1, { message: t('validation.profile.addressRequired') })
      .max(255, { message: t('validation.profile.addressMax') }),
    avatar: z.instanceof(File).optional().or(z.string().optional()),
    bankAccount: z
      .string()
      .max(30, { message: t('validation.profile.bankAccountInvalid') })
      .refine((val) => /^[0-9]+$/.test(val), {
        message: t('validation.profile.bankAccountInvalid'),
      }),
    bankAccountName: z
      .string()
      .min(1, { message: t('validation.profile.bankAccountNameRequired') })
      .max(100, { message: t('validation.profile.bankAccountNameMax') }),
  });

export type ProfileUpdateFormType = z.infer<ReturnType<typeof profileUpdateFormSchema>>;
