import { z } from 'zod';

export const updateRoleFormSchema = z.object({
  id: z.string(),
  name: z.string().trim(),
  description: z.string().trim(),
});

export type UpdateRoleFormType = z.infer<typeof updateRoleFormSchema>;
