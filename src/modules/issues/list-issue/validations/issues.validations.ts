import { z } from 'zod';

import { IssuePriorityEnum } from '../types';

import { getDateField } from '@/validations';

export const issueFormSchema = z.object({
  projectId: z.string().trim().uuid().optional(),
  labelId: z.string().trim().uuid().optional(),
  statusId: z.string().trim().uuid().optional(),
  subject: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).optional(),
  startDate: getDateField(),
  dueDate: getDateField(),
  parentIssueId: z.string().trim().uuid().optional(),
  percentage: z.number().int().min(0).max(100).optional(),
  priority: z.nativeEnum(IssuePriorityEnum),
  assigneeId: z.string().trim().uuid().optional(),
  estimatedTime: z.number().min(0).max(1000).optional(),
});

export type IssueFormValues = z.infer<typeof issueFormSchema>;
