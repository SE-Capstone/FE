import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useCreateApplicantMutation } from '../../apis/create-applicant.api';
import { applicantFormSchema } from '../../validations/applicants.validations';

import type { ApplicantFormValues } from '../../validations/applicants.validations';

import { formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useCreateApplicantHook() {
  const { t } = useTranslation();
  const formCreateApplicant = useFormWithSchema({
    schema: applicantFormSchema(t),
  });

  const { reset } = formCreateApplicant;

  const { mutate, isPending: isLoading, ...restData } = useCreateApplicantMutation({ reset });

  const handleCreateApplicant = useCallback(
    async (values: ApplicantFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            ...values,
            startDate: values.startDate
              ? formatDate({
                  date: values.startDate,
                  format: 'YYYY-MM-DD',
                })
              : undefined,
          },
        });
      } catch (error) {}
    },
    [mutate, isLoading]
  );

  return {
    formCreateApplicant,
    handleCreateApplicant,
    isLoading,
    ...restData,
  };
}
