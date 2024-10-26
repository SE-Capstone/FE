import { z } from 'zod';

export const upsertMembersFormSchema = (t: any) =>
  z.object({
    projectId: z.string().trim().uuid().optional(),
    memberIds: z.array(z.string()).min(1, { message: t('validation.memberRequired') }),
  });

export type UpsertMembersFormType = z.infer<ReturnType<typeof upsertMembersFormSchema>>;
