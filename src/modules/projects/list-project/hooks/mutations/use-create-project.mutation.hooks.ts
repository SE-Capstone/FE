import { useCallback } from 'react';

import { useCreateProjectMutation } from '../../apis/create-project.api';
import { projectFormSchema } from '../../validations/projects.validations';

import type { ProjectFormValues } from '../../validations/projects.validations';

import { formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useCreateProjectHook() {
  const formCreateProject = useFormWithSchema({
    schema: projectFormSchema,
  });

  const { reset } = formCreateProject;

  const { mutate, isPending: isLoading, ...restData } = useCreateProjectMutation({ reset });

  const handleCreateProject = useCallback(
    async (values: ProjectFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            ...values,
            startDate: formatDate({
              date: values.startDate,
              format: 'YYYY-MM-DD',
            }),
            endDate: formatDate({
              date: values.endDate,
              format: 'YYYY-MM-DD',
            }),
          },
        });
      } catch (error) {}
    },
    [mutate, isLoading]
  );

  return {
    formCreateProject,
    handleCreateProject,
    isLoading,
    ...restData,
  };
}
