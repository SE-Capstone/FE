import { z } from 'zod';

import { getDateField } from '@/validations';

export const phaseFormSchema = (t: any) =>
  z
    .object({
      title: z
        .string()
        .trim()
        .min(1, { message: t('validation.titleRequired') }),
      description: z
        .string()
        .trim()
        .max(900, { message: t('validation.descriptionMax') })
        .optional(),
      expectedStartDate: getDateField(t),
      expectedEndDate: getDateField(t),
      projectId: z.string().optional(),
    })
    .refine((data) => data.expectedEndDate >= data.expectedStartDate, {
      message: t('validation.project.endDateInvalid'),
      path: ['endDate'],
    });

export type PhaseFormValues = z.infer<ReturnType<typeof phaseFormSchema>>;
