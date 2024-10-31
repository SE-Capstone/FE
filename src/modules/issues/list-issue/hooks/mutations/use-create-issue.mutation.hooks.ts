import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useCreateIssueMutation } from '../../apis/create-issue.api';
import { issueFormSchema } from '../../validations/issues.validations';

import type { IssueFormValues } from '../../validations/issues.validations';

import { formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useCreateIssueHook() {
  const { t } = useTranslation();
  const { projectId } = useParams();
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
            projectId: projectId || '',
            labelId: values.labelId,
            statusId: values.statusId || '',
            assigneeId: values.assigneeId,
            startDate: values.startDate
              ? formatDate({
                  date: values.startDate,
                  format: 'YYYY-MM-DD',
                })
              : undefined,
            dueDate: values.dueDate
              ? formatDate({
                  date: values.dueDate,
                  format: 'YYYY-MM-DD',
                })
              : undefined,
          },
        });
      } catch (error) {}
    },
    [isLoading, mutate, projectId]
  );

  return {
    formCreateIssue,
    handleCreateIssue,
    isLoading,
    ...restData,
  };
}
