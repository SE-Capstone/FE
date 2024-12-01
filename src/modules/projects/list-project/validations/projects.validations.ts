import { isNaN } from 'lodash-es';
import { z } from 'zod';

import { ProjectStatusEnum } from '../types';

import { getDateField, getOptionalDateField } from '@/validations';

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
      startDate: getOptionalDateField(),
      endDate: getOptionalDateField(),
      status: z
        .nativeEnum(ProjectStatusEnum, { message: t('validation.project.invalidStatus') })
        .optional(),
      leadId: z.string().trim().min(1).uuid().optional(),
      totalEffort: z.preprocess(
        (val) => {
          const numberValue = Number(val);
          return isNaN(numberValue) ? undefined : numberValue;
        },
        z
          .number({ message: t('validation.project.totalEffortNumber') })
          .min(0, { message: t('validation.project.totalEffortTimeMin') })
          .max(10000000, { message: t('validation.project.totalEffortTimeMax') })
          .optional()
      ),
    })
    .refine(
      (data) => {
        if (!data.endDate || !data.startDate) return true;
        return data.endDate >= data.startDate;
      },
      {
        message: t('validation.project.endDateInvalid'),
        path: ['endDate'],
      }
    );

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
      // totalEffort: z
      //   .number({ message: t('validation.project.totalEffortNumber') })
      //   .min(0, { message: t('validation.project.totalEffortTimeMin') })
      //   .max(10000000, { message: t('validation.project.totalEffortTimeMax') })
      //   .optional(),
      totalEffort: z.preprocess(
        (val) => {
          const numberValue = Number(val);
          return isNaN(numberValue) ? undefined : numberValue;
        },
        z
          .number({ message: t('validation.project.totalEffortNumber') })
          .min(0, { message: t('validation.project.totalEffortTimeMin') })
          .max(10000000, { message: t('validation.project.totalEffortTimeMax') })
          .optional()
      ),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: t('validation.project.endDateInvalid'),
      path: ['endDate'],
    });

export type ProjectFormValues = z.infer<ReturnType<typeof projectFormSchema>>;
