import { useEffect, useState } from 'react';

import { useRemoveStatusMutation } from '../../apis/delete-status.api';

import type { IStatus } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveStatusHook(isDefault?: boolean) {
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
      title: 'Delete status',
      description: `Are you sure to delete status "${status.name}"?`,
      textConfirm: 'Delete',
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
