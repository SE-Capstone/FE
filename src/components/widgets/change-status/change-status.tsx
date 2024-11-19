import { useEffect, useState } from 'react';

import { Switch, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import type { IStatus } from '@/modules/statuses/types';
import type { SwitchProps } from '@chakra-ui/react';

import { useAlertDialogStore } from '@/contexts';
import { useToggleVisibleProjectMutation } from '@/modules/projects/list-project/apis/toggle-visible-project.api';
import { useUpsertStatusHook } from '@/modules/statuses/hooks/mutations';

interface ChangeStatusProps extends SwitchProps {
  id: string;
  initStatus: boolean;
  reset?: () => void;
  isLoading?: boolean;
  title: string;
  description: string;
  isUpdateStatus?: boolean;
  status?: IStatus;
  isDefault?: boolean;
}

export function ChangeStatus(props: ChangeStatusProps) {
  const {
    initStatus,
    isLoading,
    title,
    description,
    id,
    isUpdateStatus,
    status,
    isDefault,
    ...rest
  } = props;
  const { t } = useTranslation();
  const [isInactive, setIsInactive] = useState(initStatus === false);
  const [loading, setLoading] = useState(false);

  const { openAlert, closeAlert } = useAlertDialogStore(isLoading || loading);
  const { mutate, isPending: isLoadingUpdate } = useToggleVisibleProjectMutation({
    closeAlert,
  });

  const { handleUpsertStatus, isLoading: isLoadingUpdate2 } = useUpsertStatusHook({
    id: status?.id,
    isUpdate: true,
    onClose: closeAlert,
    isDefault,
    isNotReload: true,
  });

  useEffect(() => {
    setLoading(isLoadingUpdate);
  }, [isLoadingUpdate]);

  function handleChangeSwitch() {
    openAlert({
      title: isUpdateStatus ? (isInactive ? t('actions.active') : t('actions.inactive')) : title,
      description: isUpdateStatus
        ? isInactive
          ? t('actions.markAsDone')
          : t('actions.markAsUndone')
        : description,
      type: isUpdateStatus ? 'info' : 'warning',
      onHandleConfirm() {
        try {
          if (isUpdateStatus && status) {
            handleUpsertStatus({
              name: status.name,
              description: status.description,
              color: status.color as any,
              isDone: isInactive,
            });
          }

          if (!isUpdateStatus) {
            mutate(id);
          }
          setIsInactive((prev) => !prev);
        } catch (error) {
          setIsInactive((prev) => !prev);
        }
      },
    });
  }

  return (
    <Tooltip
      label={
        isUpdateStatus
          ? isInactive
            ? t('actions.isDone')
            : t('actions.unDone')
          : isInactive
          ? t('actions.unarchive')
          : t('actions.archive')
      }
      hasArrow
      placement="top"
      shouldWrapChildren
    >
      <Switch
        size="md"
        isDisabled={isLoading || isLoadingUpdate || isLoadingUpdate2}
        isChecked={!isInactive}
        onChange={handleChangeSwitch}
        {...rest}
      />
    </Tooltip>
  );
}
