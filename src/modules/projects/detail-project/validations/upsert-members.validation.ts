import { z } from 'zod';

export const upsertMembersFormSchema = z.object({
  projectId: z.string().trim().uuid().optional(),
  memberIds: z.array(z.string()).min(1),
});

export type UpsertMembersFormType = z.infer<typeof upsertMembersFormSchema>;
