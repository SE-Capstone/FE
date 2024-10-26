import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemoveStatusMutation } from '../../apis/delete-status.api';

import type { IStatus } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveStatusHook(isDefault?: boolean) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveStatusMutation({
    closeAlert,
    isDefault,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveStatus(status: IStatus) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.status').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.status').toLowerCase()} ${
        status.name
      }?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate({
          body: {
            id: status.id,
            isDefault,
          },
        });
      },
    });
  }

  return {
    handleRemoveStatus,
  };
}
