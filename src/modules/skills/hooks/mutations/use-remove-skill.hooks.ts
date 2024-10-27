import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemoveSkillMutation } from '../../apis/delete-skill.api';

import type { ISkill } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveSkillHook() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveSkillMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveSkill(skill: ISkill) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.skill').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.skill').toLowerCase()} ${
        skill.title
      }?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate({
          body: {
            id: skill.id,
          },
        });
      },
    });
  }

  return {
    handleRemoveSkill,
  };
}
