import { z } from 'zod';

export const positionFormSchema = (t: any) =>
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

export type PositionFormValues = z.infer<ReturnType<typeof positionFormSchema>>;
