import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useCompletePhaseMutation } from '../../apis/complete-phase.api';

import { useAlertDialogStore } from '@/contexts';

export function useCompletePhaseHook() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useCompletePhaseMutation({
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
            projectId: projectId || '',
          },
        });
      },
    });
  }

  return {
    handleCompletePhase,
  };
}
