import { z } from 'zod';

import { ProjectStatusEnum } from '../types';

import { getDateField } from '@/validations';

export const projectFormSchema = (t: any) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, { message: t('validation.project.nameRequired') })
        .max(255, { message: t('validation.project.nameMax') }),
      code: z
        .string()
        .trim()
        .min(1, { message: t('validation.project.codeRequired') })
        .max(100, { message: t('validation.project.codeMax') }),
      description: z
        .string()
        .trim()
        .min(1, { message: t('validation.descriptionRequired') }),
      startDate: getDateField(t),
      endDate: getDateField(t),
      status: z
        .nativeEnum(ProjectStatusEnum, { message: t('validation.project.invalidStatus') })
        .optional(),
      leadId: z.string().trim().min(1).uuid().optional(),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: t('validation.project.endDateInvalid'),
      path: ['endDate'],
    });

export const projectUpdateFormSchema = (t: any) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, { message: t('validation.project.nameRequired') })
        .max(255, { message: t('validation.project.nameMax') }),
      code: z
        .string()
        .trim()
        .min(1, { message: t('validation.project.codeRequired') })
        .max(100, { message: t('validation.project.codeMax') }),
      description: z
        .string()
        .trim()
        .min(1, { message: t('validation.descriptionRequired') }),
      startDate: getDateField(t),
      endDate: getDateField(t),
      status: z.nativeEnum(ProjectStatusEnum, { message: t('validation.project.invalidStatus') }),
      leadId: z.string().trim().min(1).uuid().optional(),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: t('validation.project.endDateInvalid'),
      path: ['endDate'],
    });

export type ProjectFormValues = z.infer<ReturnType<typeof projectFormSchema>>;
