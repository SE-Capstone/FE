import { useCallback } from 'react';

import { useUpsertJobMutation } from '../../apis/upsert-job.api';
import { jobFormSchema } from '../../validations/jobs.validations';

import type { JobFormValues } from '../../validations/jobs.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertJobHook({
  id,
  isUpdate,
  onClose,
}: {
  id?: string;
  isUpdate?: boolean;
  onClose: () => void;
}) {
  const formUpsertJob = useFormWithSchema({
    schema: jobFormSchema,
  });

  const { reset } = formUpsertJob;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertJobMutation({ onClose, reset, isUpdate });

  const handleUpsertJob = useCallback(
    async (values: JobFormValues) => {
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
    formUpsertJob,
    handleUpsertJob,
    isLoading,
    ...restData,
  };
}
