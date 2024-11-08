import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemovePositionMutation } from '../../apis/delete-position.api';

import type { IPosition } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemovePositionHook() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemovePositionMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemovePosition(position: IPosition) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.position').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.position').toLowerCase()} ${
        position.title
      }?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate({
          body: {
            id: position.id,
          },
        });
      },
    });
  }

  return {
    handleRemovePosition,
  };
}
