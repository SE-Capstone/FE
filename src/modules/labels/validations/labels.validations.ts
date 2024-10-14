import { z } from 'zod';

export const labelFormSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).max(500).optional(),
  projectId: z.string().optional(),
});

export type LabelFormValues = z.infer<typeof labelFormSchema>;
