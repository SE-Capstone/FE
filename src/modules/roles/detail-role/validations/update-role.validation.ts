import { z } from 'zod';

export const updateRoleFormSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export type UpdateRoleFormType = z.infer<typeof updateRoleFormSchema>;
