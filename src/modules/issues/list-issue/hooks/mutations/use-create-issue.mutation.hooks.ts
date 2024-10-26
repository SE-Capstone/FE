import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useCreateIssueMutation } from '../../apis/create-issue.api';
import { issueFormSchema } from '../../validations/issues.validations';

import type { IssueFormValues } from '../../validations/issues.validations';

import { formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useCreateIssueHook() {
  const { t } = useTranslation();
  const formCreateIssue = useFormWithSchema({
    schema: issueFormSchema(t),
  });

  const { reset } = formCreateIssue;

  const { mutate, isPending: isLoading, ...restData } = useCreateIssueMutation({ reset });

  const handleCreateIssue = useCallback(
    async (values: IssueFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            ...values,
            projectId: values.projectId || '',
            labelId: values.labelId || '',
            statusId: values.statusId || '',
            assigneeId: values.assigneeId || '',
            startDate: formatDate({
              date: values.startDate,
              format: 'YYYY-MM-DD',
            }),
            dueDate: formatDate({
              date: values.dueDate,
              format: 'YYYY-MM-DD',
            }),
          },
        });
      } catch (error) {}
    },
    [mutate, isLoading]
  );

  return {
    formCreateIssue,
    handleCreateIssue,
    isLoading,
    ...restData,
  };
}
