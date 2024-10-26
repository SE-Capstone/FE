import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemoveLabelMutation } from '../../apis/delete-label.api';

import type { ILabel } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveLabelHook(isDefault?: boolean) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveLabelMutation({
    closeAlert,
    isDefault,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveLabel(label: ILabel) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.label').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.label').toLowerCase()} ${
        label.title
      }?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate({
          body: {
            id: label.id,
            isDefault,
          },
        });
      },
    });
  }

  return {
    handleRemoveLabel,
  };
}
