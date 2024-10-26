import { z } from 'zod';

import { GenderEnum, REGEX_PASSWORD, UserStatusEnum } from '@/configs';
import { getBirthdayField } from '@/validations';

export const userFormSchema = (t: any) =>
  z.object({
    fullName: z
      .string()
      .trim()
      .min(1, { message: t('validation.profile.fullNameRequired') })
      .max(100, { message: t('validation.profile.fullNameMax') }),
    userName: z
      .string()
      .trim()
      .min(1, { message: t('validation.profile.usernameRequired') })
      .max(100, { message: t('validation.profile.usernameMax') }),
    email: z
      .string()
      .trim()
      .min(1, { message: t('validation.emailRequired') })
      .max(100, { message: t('validation.emailMax') })
      .email({ message: t('validation.emailInvalid') }),
    password: z
      .string()
      .trim()
      .min(6, { message: t('validation.passwordMin') })
      .max(255, { message: t('validation.passwordMax') })
      .regex(REGEX_PASSWORD, t('validation.passwordComplexity')),
    phone: z
      .string()
      .trim()
      .min(8, { message: t('validation.phoneMin') })
      .max(15, { message: t('validation.phoneMax') }),
    gender: z.nativeEnum(GenderEnum, { message: t('validation.profile.invalidGender') }),
    dob: getBirthdayField(t),
    status: z
      .nativeEnum(UserStatusEnum, { message: t('validation.profile.invalidStatus') })
      .optional(),
    address: z
      .string()
      .trim()
      .min(1, { message: t('validation.profile.addressRequired') })
      .max(255, { message: t('validation.profile.addressMax') }),
    roleId: z.string().trim().min(1),
    positionId: z.string().trim().min(1),
  });

export type UserFormValues = z.infer<ReturnType<typeof userFormSchema>>;
