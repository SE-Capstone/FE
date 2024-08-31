import { useState } from 'react';

import { Switch, Tooltip } from '@chakra-ui/react';

import type { SwitchProps } from '@chakra-ui/react';

import { UserStatusEnum } from '@/configs';
import { useAlertDialogStore } from '@/contexts';

interface ChangeStatusProps extends SwitchProps {
  initStatus: UserStatusEnum;
  onChangeStatus(status: UserStatusEnum, onSuccess: () => void): void;
  reset: () => void;
  isLoading?: boolean;
}

export function ChangeStatus(props: ChangeStatusProps) {
  const { initStatus, onChangeStatus, reset, isLoading, ...rest } = props;
  const [isInactive, setIsInactive] = useState(initStatus === UserStatusEnum.Inactive);

  const { openAlert, closeAlert } = useAlertDialogStore(isLoading);

  function handleChangeSwitch() {
    reset();
    openAlert({
      title: 'Confirm update status',
      description: `Are you sure to ${isInactive ? 'hide' : 'show'} user?`,
      onHandleConfirm() {
        onChangeStatus?.(isInactive ? UserStatusEnum.Inactive : UserStatusEnum.Active, () => {
          closeAlert();
          setIsInactive((prev) => !prev);
        });
      },
    });
  }

  return (
    <Tooltip label={isInactive ? 'Show' : 'Hide'} hasArrow placement="top" shouldWrapChildren>
      <Switch
        key={initStatus}
        size="lg"
        isDisabled={isLoading}
        isChecked={!isInactive}
        onChange={handleChangeSwitch}
        {...rest}
      />
    </Tooltip>
  );
}
