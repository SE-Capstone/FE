import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useNewCompletePhaseMutation } from '../../apis/new-complete-phase.api';

import { useAlertDialogStore } from '@/contexts';

export function useNewCompletePhaseHook({ phaseId }: { phaseId: string }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useNewCompletePhaseMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleCompletePhase(isRunningPhase: boolean) {
    if (isPending) return;

    openAlert({
      title: isRunningPhase ? t('common.completePhase') : t('common.startPhase'),
      description: isRunningPhase ? t('actions.completePhaseDesc') : t('actions.startPhaseDesc'),
      textConfirm: isRunningPhase ? t('actions.completePhase') : t('actions.startPhase'),
      type: 'warning',
      onHandleConfirm() {
        mutate({
          body: {
            phaseId,
          },
        });
      },
    });
  }

  return {
    handleCompletePhase,
  };
}
