import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useUpsertLabelMutation } from '../../apis/upsert-label.api';
import { labelFormSchema } from '../../validations/labels.validations';

import type { LabelFormValues } from '../../validations/labels.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertLabelHook({
  id,
  isUpdate,
  onClose,
  isDefault,
}: {
  id?: string;
  isUpdate?: boolean;
  onClose: () => void;
  isDefault?: boolean;
}) {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const formUpsertLabel = useFormWithSchema({
    schema: labelFormSchema(t),
  });

  const { reset } = formUpsertLabel;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertLabelMutation({ onClose, reset, id, isUpdate, isDefault });

  const handleUpsertLabel = useCallback(
    async (values: LabelFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            ...values,
            projectId: projectId || '',
          },
        });
      } catch (error) {}
    },
    [isLoading, mutate, projectId]
  );

  return {
    formUpsertLabel,
    handleUpsertLabel,
    isLoading,
    ...restData,
  };
}
