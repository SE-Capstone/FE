import { z } from 'zod';

export const createRoleFormSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  permissionsId: z.array(z.string().uuid()).min(1),
});

export type CreateRoleFormType = z.infer<typeof createRoleFormSchema>;
