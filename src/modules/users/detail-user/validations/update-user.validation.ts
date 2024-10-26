import { z } from 'zod';

import { GenderEnum, UserStatusEnum } from '@/configs';
import { getBirthdayField } from '@/validations';

export const updateUserFormSchema = (t: any) =>
  z.object({
    id: z.string().optional(),
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
    status: z.nativeEnum(UserStatusEnum, { message: t('validation.profile.invalidStatus') }),
    roleId: z
      .string()
      .trim()
      .min(1, { message: t('validation.profile.roleRequired') }),
    positionId: z
      .string()
      .trim()
      .min(1, { message: t('validation.profile.positionRequired') }),
  });

export type UpdateUserFormType = z.infer<ReturnType<typeof updateUserFormSchema>>;
