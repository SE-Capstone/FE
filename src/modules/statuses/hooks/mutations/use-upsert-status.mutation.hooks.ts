import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useUpsertStatusMutation } from '../../apis/upsert-status.api';
import { statusFormSchema } from '../../validations/statuses.validations';

import type { StatusFormValues } from '../../validations/statuses.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertStatusHook({
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
  const formUpsertStatus = useFormWithSchema({
    schema: statusFormSchema(t),
  });

  const { reset } = formUpsertStatus;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertStatusMutation({ onClose, reset, id, isUpdate, isDefault });

  const handleUpsertStatus = useCallback(
    async (values: StatusFormValues) => {
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
    formUpsertStatus,
    handleUpsertStatus,
    isLoading,
    ...restData,
  };
}
