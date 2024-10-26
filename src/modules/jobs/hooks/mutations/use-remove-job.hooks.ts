import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemoveJobMutation } from '../../apis/delete-job.api';

import type { IJob } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveJobHook() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveJobMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveJob(job: IJob) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.job').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.job').toLowerCase()} ${job.title}?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate({
          body: {
            id: job.id,
          },
        });
      },
    });
  }

  return {
    handleRemoveJob,
  };
}
