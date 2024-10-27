import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useUpsertPhaseMutation } from '../../apis/upsert-phase.api';
import { phaseFormSchema } from '../../validations/phases.validations';

import type { PhaseFormValues } from '../../validations/phases.validations';

import { formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertPhaseHook({
  id,
  isUpdate,
  onClose,
  isDefault,
}: {
  id?: string;
  isUpdate?: boolean;
  isDefault?: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const formUpsertPhase = useFormWithSchema({
    schema: phaseFormSchema(t),
  });

  const { reset } = formUpsertPhase;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertPhaseMutation({ onClose, reset, id, isUpdate, isDefault });

  const handleUpsertPhase = useCallback(
    (values: PhaseFormValues) => {
      if (isLoading) return;

      try {
        mutate({
          body: {
            ...values,
            expectedStartDate: formatDate({
              date: values.expectedStartDate,
              format: 'YYYY-MM-DD',
            }),
            expectedEndDate: formatDate({
              date: values.expectedEndDate,
              format: 'YYYY-MM-DD',
            }),
            projectId: projectId || '',
          },
        });
      } catch (error) {}
    },
    [isLoading, mutate, projectId]
  );

  return {
    formUpsertPhase,
    handleUpsertPhase,
    isLoading,
    ...restData,
  };
}
