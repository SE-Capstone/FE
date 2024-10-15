import { z } from 'zod';

export const removeStatusFormSchema = z.object({
  newStatusId: z.string().uuid(),
});

export type RemoveStatusFormValues = z.infer<typeof removeStatusFormSchema>;
