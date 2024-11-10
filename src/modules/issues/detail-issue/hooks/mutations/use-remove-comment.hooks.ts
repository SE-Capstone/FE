import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemoveCommentMutation } from '../../apis/delete-comment.api';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveCommentHook(id: string) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveCommentMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveComment() {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.comment').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.comment').toLowerCase()}?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate(id);
      },
    });
  }

  return {
    handleRemoveComment,
  };
}
