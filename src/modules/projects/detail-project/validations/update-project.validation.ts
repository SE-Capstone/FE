import { z } from 'zod';

import { ProjectStatusEnum } from '../../list-project/types';

import { getDateField } from '@/validations';

export const updateProjectFormSchema = z
  .object({
    id: z.string().trim().min(1).uuid().optional(),
    name: z.string().trim().min(1).max(255),
    code: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1),
    startDate: getDateField(),
    endDate: getDateField(),
    status: z.nativeEnum(ProjectStatusEnum, { message: 'Invalid status' }),
    isVisible: z.boolean(),
    leadId: z.string().trim().min(1).uuid().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export type UpdateProjectFormType = z.infer<typeof updateProjectFormSchema>;
