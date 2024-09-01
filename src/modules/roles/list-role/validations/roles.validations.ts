import { z } from 'zod';

export const roleFormSchema = z.object({
  roleName: z.string().trim().min(1).max(30),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
