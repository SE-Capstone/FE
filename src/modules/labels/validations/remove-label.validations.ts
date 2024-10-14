import { z } from 'zod';

export const removeLabelFormSchema = z.object({
  newLabelId: z.string().uuid(),
});

export type RemoveLabelFormValues = z.infer<typeof removeLabelFormSchema>;
