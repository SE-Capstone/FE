import { z } from 'zod';

export const labelFormSchema = z.object({
  title: z.string().trim().min(1).max(20),
  description: z.string().trim().max(500).optional(),
  projectId: z.string().optional(),
});

export type LabelFormValues = z.infer<typeof labelFormSchema>;
