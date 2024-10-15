import { z } from 'zod';

export const statusFormSchema = z.object({
  name: z.string().trim().min(1).max(20),
  description: z.string().trim().max(500).optional(),
  color: z.string().trim().min(1).max(500),
  projectId: z.string().optional(),
});

export type StatusFormValues = z.infer<typeof statusFormSchema>;
