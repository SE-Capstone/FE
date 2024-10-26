import { z } from 'zod';

import { getOptionalDateField } from '@/validations';

export const applicantFormSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('validation.nameRequired') })
      .max(100, { message: t('validation.nameMax') }),
    email: z
      .string()
      .trim()
      .min(1, { message: t('validation.emailRequired') })
      .max(100, { message: t('validation.emailMax') })
      .email({ message: t('validation.emailInvalid') }),
    phoneNumber: z
      .string()
      .trim()
      .min(8, { message: t('validation.phoneMin') })
      .max(15, { message: t('validation.phoneMax') }),
    startDate: getOptionalDateField(),
    cvFile: z.instanceof(File).optional().or(z.string().optional()),
  });

export type ApplicantFormValues = z.infer<ReturnType<typeof applicantFormSchema>>;
