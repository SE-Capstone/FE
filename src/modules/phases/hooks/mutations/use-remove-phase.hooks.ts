import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemovePhaseMutation } from '../../apis/delete-phase.api';

import type { IPhase } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemovePhaseHook() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemovePhaseMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemovePhase(phase: IPhase) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.phase').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.phase').toLowerCase()} "${
        phase.title
      }"?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate({
          body: {
            id: phase.id,
          },
        });
      },
    });
  }

  return {
    handleRemovePhase,
  };
}
