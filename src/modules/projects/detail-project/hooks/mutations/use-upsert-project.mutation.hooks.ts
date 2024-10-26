import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import type { ProjectFormValues } from '@/modules/projects/list-project/validations/projects.validations';

import { formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { useUpsertProjectMutation } from '@/modules/projects/list-project/apis/upsert-project.api';
import {
  projectFormSchema,
  projectUpdateFormSchema,
} from '@/modules/projects/list-project/validations/projects.validations';

export function useUpsertProjectHook({
  id,
  isUpdate,
  onClose,
}: {
  id?: string;
  isUpdate?: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const formUpsertProject = useFormWithSchema({
    schema: isUpdate ? projectUpdateFormSchema(t) : projectFormSchema(t),
  });

  const { reset } = formUpsertProject;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertProjectMutation({ onClose, reset, id, isUpdate });

  const handleUpsertProject = useCallback(
    async (values: ProjectFormValues) => {
      if (isLoading) return;

      try {
        mutate({
          body: {
            ...values,
            id,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, mutate]
  );

  return {
    formUpsertProject,
    handleUpsertProject,
    isLoading,
    ...restData,
  };
}
