import { isNaN } from 'lodash-es';
import { z } from 'zod';

import { IssuePriorityEnum } from '../types';

import { getOptionalDateField } from '@/validations';

export const issueFormSchema = (t: any) =>
  z.object({
    id: z.string().trim().uuid().optional(),
    projectId: z.string().trim().uuid().optional(),
    labelId: z.string().trim().uuid().optional(),
    phaseId: z.string().trim().uuid().optional(),
    statusId: z
      .string({ message: t('validation.fieldRequired') })
      .trim()
      .uuid({ message: t('validation.fieldRequired') }),
    title: z
      .string()
      .trim()
      .min(1, { message: t('validation.issue.subjectRequired') })
      .max(500, { message: t('validation.issue.subjectMax') }),
    description: z.any().optional(),
    startDate: getOptionalDateField(),
    dueDate: getOptionalDateField(),
    actualDate: getOptionalDateField(),
    parentIssueId: z.string().trim().uuid().optional(),
    percentage: z
      .preprocess(
        (val) => {
          const numberValue = Number(val);
          return isNaN(numberValue) ? undefined : numberValue;
        },
        z
          .number({ message: t('validation.issue.percentageInteger') })
          .int({ message: t('validation.issue.percentageInteger') })
          .min(0, { message: t('validation.issue.percentageMin') })
          .max(100, { message: t('validation.issue.percentageMax') })
          .default(0)
          .optional()
      )
      .optional(),
    priority: z
      .nativeEnum(IssuePriorityEnum, { message: t('validation.issue.invalidPriority') })
      .default(IssuePriorityEnum.Medium),
    assigneeId: z
      .string()
      .trim()
      .uuid({ message: t('validation.fieldRequired') })
      .optional(),
    reporterId: z
      .string()
      .trim()
      .uuid({ message: t('validation.fieldRequired') })
      .optional(),
    estimatedTime: z.preprocess(
      (val) => {
        const numberValue = Number(val);
        return isNaN(numberValue) ? undefined : numberValue;
      },
      z
        .number({ message: t('validation.issue.estimatedNumber') })
        .min(0, { message: t('validation.issue.estimatedTimeMin') })
        .max(1000, { message: t('validation.issue.estimatedTimeMax') })
        .optional()
    ),
    actualTime: z.preprocess(
      (val) => {
        const numberValue = Number(val);
        return isNaN(numberValue) ? undefined : numberValue;
      },
      z
        .number({ message: t('validation.issue.actualNumber') })
        .min(0, { message: t('validation.issue.actualTimeMin') })
        .max(1000, { message: t('validation.issue.actualTimeMax') })
        .optional()
    ),
  });

export type IssueFormValues = z.infer<ReturnType<typeof issueFormSchema>>;
