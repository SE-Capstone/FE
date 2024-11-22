import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useUpsertApplicantMutation } from '../../apis/upsert-applicant.api';
import { applicantFormSchema } from '../../validations/applicants.validations';

import type { ApplicantFormValues } from '../../validations/applicants.validations';

import { formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertApplicantHook({
  id,
  cvLink,
  isUpdate,
  onClose,
}: {
  id?: string;
  cvLink?: string;
  isUpdate?: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const formUpsertApplicant = useFormWithSchema({
    schema: applicantFormSchema(t),
  });

  const { reset } = formUpsertApplicant;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertApplicantMutation({ reset, isUpdate, onClose });

  const handleUpsertApplicant = useCallback(
    async (values: ApplicantFormValues) => {
      if (isLoading) return;

      if (!values?.cvFile && isUpdate) {
        values.cvFile = cvLink;
      }

      try {
        await mutate({
          body: {
            ...values,
            id,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, mutate, id]
  );

  return {
    formUpsertApplicant,
    handleUpsertApplicant,
    isLoading,
    ...restData,
  };
}
