import { z } from 'zod';

import { ProjectStatusEnum } from '../types';

import { getDateField } from '@/validations';

export const projectFormSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    code: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1),
    startDate: getDateField(),
    endDate: getDateField(),
    status: z.nativeEnum(ProjectStatusEnum, { message: 'Invalid status' }).optional(),
    leadId: z.string().trim().min(1).uuid().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export const projectUpdateFormSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    code: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1),
    startDate: getDateField(),
    endDate: getDateField(),
    status: z.nativeEnum(ProjectStatusEnum, { message: 'Invalid status' }),
    leadId: z.string().trim().min(1).uuid().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
