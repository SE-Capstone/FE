import { z } from 'zod';

export const labelFormSchema = (t: any) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: t('validation.titleRequired') })
      .max(20, { message: t('validation.label.titleMax') }),
    description: z
      .string()
      .trim()
      .max(500, { message: t('validation.label.descriptionMax') })
      .optional(),
    projectId: z.string().optional(),
  });

export type LabelFormValues = z.infer<ReturnType<typeof labelFormSchema>>;
