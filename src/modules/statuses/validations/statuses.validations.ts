import { z } from 'zod';

export const statusFormSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('validation.status.nameRequired') })
      .max(20, { message: t('validation.status.nameMax') }),
    description: z
      .string()
      .trim()
      .max(500, { message: t('validation.status.descriptionMax') })
      .optional(),
    color: z
      .string()
      .trim()
      .min(1, { message: t('validation.status.colorRequired') }),
    projectId: z.string().optional(),
  });

export type StatusFormValues = z.infer<ReturnType<typeof statusFormSchema>>;
