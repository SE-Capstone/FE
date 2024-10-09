import { z } from 'zod';

export const positionFormSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export type PositionFormValues = z.infer<typeof positionFormSchema>;
