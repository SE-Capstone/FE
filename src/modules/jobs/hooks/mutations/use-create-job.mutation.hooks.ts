import { useCallback } from 'react';

import { useCreateJobMutation } from '../../apis/create-job.api';
import { jobFormSchema } from '../../validations/jobs.validations';

import type { JobFormValues } from '../../validations/jobs.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useCreateJobHook() {
  const formCreateJob = useFormWithSchema({
    schema: jobFormSchema,
  });

  const { reset } = formCreateJob;

  const { mutate, isPending: isLoading, ...restData } = useCreateJobMutation({ reset });

  const handleCreateJob = useCallback(
    async (values: JobFormValues) => {
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
    formCreateJob,
    handleCreateJob,
    isLoading,
    ...restData,
  };
}
