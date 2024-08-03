import { z } from 'zod';

export const profileFormSchemaBase = z.object({
  firstname: z.string().trim().max(50, 'Tối đa 50 ký tự ').nullish(),
  lastname: z.string().trim().max(50, 'Tối đa 50 ký tự').nullish(),
  avatar: z.instanceof(File).nullish().or(z.string().trim().nullish()),
  address: z.string().trim().nullish(),
});

export const profileUpdateFormSchema = profileFormSchemaBase.deepPartial();

export type ProfileUpdateFormType = z.infer<typeof profileUpdateFormSchema>;

export const profileCreateFormSchema = profileFormSchemaBase;

export type ProfileCreateFormType = z.infer<typeof profileCreateFormSchema>;
