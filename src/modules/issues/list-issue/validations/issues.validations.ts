import { z } from 'zod';

import { IssuePriorityEnum } from '../types';

import { getDateField } from '@/validations';

export const issueFormSchema = (t: any) =>
  z.object({
    projectId: z.string().trim().uuid().optional(),
    labelId: z.string().trim().uuid().optional(),
    statusId: z.string().trim().uuid().optional(),
    subject: z
      .string()
      .trim()
      .min(1, { message: t('validation.issue.subjectRequired') })
      .max(500, { message: t('validation.issue.subjectMax') }),
    description: z.string().trim().min(1).optional(),
    startDate: getDateField(t),
    dueDate: getDateField(t),
    parentIssueId: z.string().trim().uuid().optional(),
    percentage: z
      .number()
      .int({ message: t('validation.issue.percentageInteger') })
      .min(0, { message: t('validation.issue.percentageMin') })
      .max(100, { message: t('validation.issue.percentageMax') })
      .optional(),
    priority: z.nativeEnum(IssuePriorityEnum, { message: t('validation.issue.invalidPriority') }),
    assigneeId: z.string().trim().uuid().optional(),
    estimatedTime: z
      .number()
      .min(0, { message: t('validation.issue.estimatedTimeMin') })
      .max(1000, { message: t('validation.issue.estimatedTimeMax') })
      .optional(),
  });

export type IssueFormValues = z.infer<ReturnType<typeof issueFormSchema>>;
