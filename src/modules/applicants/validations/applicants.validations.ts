import { z } from 'zod';

import { getOptionalDateField } from '@/validations';

export const applicantFormSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).max(100).email(),
  phoneNumber: z.string().trim().min(8).max(15),
  startDate: getOptionalDateField(),
  cvFile: z.instanceof(File).optional().or(z.string().optional()),
});

export type ApplicantFormValues = z.infer<typeof applicantFormSchema>;
