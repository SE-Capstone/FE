import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemoveApplicantMutation } from '../../apis/delete-applicant.api';

import type { IApplicant } from '../../types';

import { useAlertDialogStore } from '@/contexts';

export function useRemoveApplicantHook(id: string) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending } = useRemoveApplicantMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  function handleRemoveApplicant(applicant: IApplicant) {
    if (isPending) return;

    openAlert({
      title: `${t('common.delete')} ${t('common.applicant').toLowerCase()}`,
      description: `${t('actions.confirmDelete')} ${t('common.applicant').toLowerCase()} ${
        applicant.name
      }?`,
      textConfirm: t('actions.delete'),
      onHandleConfirm() {
        mutate(id);
      },
    });
  }

  return {
    handleRemoveApplicant,
  };
}
