import { z } from 'zod';

export const jobFormSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
