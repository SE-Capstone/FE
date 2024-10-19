import { useEffect, useState } from 'react';

import { useRemoveJobMutation } from '../../apis/delete-job.api';

import type { IJob } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveJobHook() {
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
      title: 'Delete job',
      description: `Are you sure to delete job "${job.title}"?`,
      textConfirm: 'Delete',
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
