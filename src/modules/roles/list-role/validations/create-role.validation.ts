import { z } from 'zod';

export const createRoleFormSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('validation.nameRequired') }),
    description: z
      .string()
      .trim()
      .min(1, { message: t('validation.descriptionRequired') }),
    permissionsId: z.array(z.string().uuid()).min(1),
  });

export type CreateRoleFormType = z.infer<ReturnType<typeof createRoleFormSchema>>;
