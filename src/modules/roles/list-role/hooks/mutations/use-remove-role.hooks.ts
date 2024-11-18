import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemoveRoleMutation } from '../../apis/delete-role.api';

import type { IRole } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveRoleHook() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveRoleMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveRole(role: IRole) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.role').toLowerCase()}`,
      description: t('actions.deleteRole', {
        roleName: role.name,
      }),
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate({
          body: {
            id: role.id,
          },
        });
      },
    });
  }

  return {
    handleRemoveRole,
  };
}
