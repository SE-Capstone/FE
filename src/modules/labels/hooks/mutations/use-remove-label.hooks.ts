import { useEffect, useState } from 'react';

import { useRemoveLabelMutation } from '../../apis/delete-label.api';

import type { ILabel } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveLabelHook() {
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveLabelMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveLabel(label: ILabel) {
    if (isPending) return;

    openAlert({
      title: 'Delete label',
      description: `Are you sure to delete label "${label.title}"?`,
      textConfirm: 'Delete',
      onHandleConfirm() {
        mutate({
          body: {
            id: label.id,
          },
        });
      },
    });
  }

  return {
    handleRemoveLabel,
  };
}
