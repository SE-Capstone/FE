import { useCallback } from 'react';

import { useCreatePositionMutation } from '../../apis/create-position.api';
import { positionFormSchema } from '../../validations/postions.validations';

import type { PositionFormValues } from '../../validations/postions.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useCreatePositionHook() {
  const formCreatePosition = useFormWithSchema({
    schema: positionFormSchema,
  });

  const { reset } = formCreatePosition;

  const { mutate, isPending: isLoading, ...restData } = useCreatePositionMutation({ reset });

  const handleCreatePosition = useCallback(
    async (values: PositionFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: values,
        });
      } catch (error) {}
    },
    [mutate, isLoading]
  );

  return {
    formCreatePosition,
    handleCreatePosition,
    isLoading,
    ...restData,
  };
}
