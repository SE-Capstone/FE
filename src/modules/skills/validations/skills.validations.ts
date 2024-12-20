import { z } from 'zod';

export const skillFormSchema = (t: any) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: t('validation.titleRequired') }),
    description: z
      .string()
      .trim()
      .min(1, { message: t('validation.descriptionRequired') })
      .max(500, { message: t('validation.descriptionMax') }),
  });

export type SkillFormValues = z.infer<ReturnType<typeof skillFormSchema>>;
