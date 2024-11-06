import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemoveIssueMutation } from '../../apis/delete-issue.api';

import type { IIssue } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveIssueHook(id: string) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveIssueMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveIssue(issue: IIssue) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.issue').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.issue').toLowerCase()} ${
        issue.title
      }?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate(id);
      },
    });
  }

  return {
    handleRemoveIssue,
  };
}
