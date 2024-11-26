import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useUpsertIssueMutation } from '../../apis/upsert-issue.api';
import { issueFormSchema } from '../../validations/issues.validations';

import type { IssueFormValues } from '../../validations/issues.validations';
import type { Editor } from '@tiptap/core';

import { formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertIssueHook(
  editor?: Editor | null,
  isUpdate?: boolean,
  id?: string,
  isRedirect?: boolean
) {
  const { t } = useTranslation();
  const { projectId, issueId } = useParams();
  const formUpsertIssue = useFormWithSchema({
    schema: issueFormSchema(t),
  });

  const { reset } = formUpsertIssue;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertIssueMutation({ reset, id: id || issueId, isUpdate, isRedirect });

  const handleUpsertIssue = useCallback(
    async (values: IssueFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            ...values,
            description: editor?.getHTML(),
            projectId: projectId || '',
            labelId: values.labelId,
            statusId: values.statusId || '',
            assigneeId: values.assigneeId,
            phaseId: values.phaseId,
            estimatedTime: values.estimatedTime || undefined,
            actualTime: values.actualTime || undefined,
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
    [editor, isLoading, mutate, projectId]
  );

  return {
    formUpsertIssue,
    handleUpsertIssue,
    isLoading,
    ...restData,
  };
}
