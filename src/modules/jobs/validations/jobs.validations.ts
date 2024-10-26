import { z } from 'zod';

export const jobFormSchema = (t: any) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: t('validation.titleRequired') }),
    description: z
      .string()
      .trim()
      .min(1, { message: t('validation.descriptionRequired') }),
  });

export type JobFormValues = z.infer<ReturnType<typeof jobFormSchema>>;
