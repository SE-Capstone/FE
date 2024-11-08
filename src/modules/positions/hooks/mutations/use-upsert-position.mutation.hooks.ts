import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useUpsertPositionMutation } from '../../apis/upsert-position.api';
import {
  positionFormSchema,
  type PositionFormValues,
} from '../../validations/postions.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertPositionHook({
  id,
  isUpdate,
  onClose,
}: {
  id?: string;
  isUpdate?: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const formUpsertPosition = useFormWithSchema({
    schema: positionFormSchema(t),
  });

  const { reset } = formUpsertPosition;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertPositionMutation({ onClose, reset, isUpdate });

  const handleUpsertPosition = useCallback(
    async (values: PositionFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            ...values,
            id,
          },
        });
      } catch (error) {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, mutate]
  );

  return {
    formUpsertPosition,
    handleUpsertPosition,
    isLoading,
    ...restData,
  };
}
