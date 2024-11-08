import { useEffect, useState } from 'react';

import { Switch, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import type { SwitchProps } from '@chakra-ui/react';

import { useAlertDialogStore } from '@/contexts';
import { useToggleVisibleProjectMutation } from '@/modules/projects/list-project/apis/toggle-visible-project.api';

interface ChangeStatusProps extends SwitchProps {
  id: string;
  initStatus: boolean;
  reset?: () => void;
  isLoading?: boolean;
  title: string;
  description: string;
}

export function ChangeStatus(props: ChangeStatusProps) {
  const { initStatus, isLoading, title, description, id, ...rest } = props;
  const { t } = useTranslation();
  const [isInactive, setIsInactive] = useState(initStatus === false);
  const [loading, setLoading] = useState(false);

  const { openAlert, closeAlert } = useAlertDialogStore(isLoading || loading);
  const { mutate, isPending: isLoadingUpdate } = useToggleVisibleProjectMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isLoadingUpdate);
  }, [isLoadingUpdate]);

  function handleChangeSwitch() {
    openAlert({
      title,
      description,
      onHandleConfirm() {
        try {
          mutate(id);
          setIsInactive((prev) => !prev);
        } catch (error) {
          setIsInactive((prev) => !prev);
        }
      },
    });
  }

  return (
    <Tooltip
      label={isInactive ? t('actions.unarchive') : t('actions.archive')}
      hasArrow
      placement="top"
      shouldWrapChildren
    >
      <Switch
        size="md"
        isDisabled={isLoading || isLoadingUpdate}
        isChecked={!isInactive}
        onChange={handleChangeSwitch}
        {...rest}
      />
    </Tooltip>
  );
}
