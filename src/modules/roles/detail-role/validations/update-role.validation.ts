import { z } from 'zod';

export const updateRoleFormSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('validation.nameRequired') }),
    description: z
      .string()
      .trim()
      .min(1, { message: t('validation.descriptionRequired') }),
  });

export type UpdateRoleFormType = z.infer<ReturnType<typeof updateRoleFormSchema>>;
