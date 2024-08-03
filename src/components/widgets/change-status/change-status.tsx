import { useState } from 'react';

import { Switch, Tooltip } from '@chakra-ui/react';

import type { SwitchProps } from '@chakra-ui/react';

import { StatusEnum } from '@/configs';
import { useAlertDialogStore } from '@/contexts';

interface ChangeStatusProps extends SwitchProps {
  initStatus: StatusEnum;
  onChangeStatus(status: StatusEnum, onSuccess: () => void): void;
  reset: () => void;
  isLoading?: boolean;
}

export function ChangeStatus(props: ChangeStatusProps) {
  const { initStatus, onChangeStatus, reset, isLoading, ...rest } = props;
  const [isInactive, setIsInactive] = useState(initStatus === StatusEnum.Inactive);

  const { openAlert, closeAlert } = useAlertDialogStore(isLoading);

  function handleChangeSwitch() {
    reset();
    openAlert({
      title: 'Xác nhận thay đổi trạng thái',
      description: `Bạn có chắc chắn muốn ${isInactive ? 'Hiển thị' : 'ẩn'} không?`,
      onHandleConfirm() {
        onChangeStatus?.(isInactive ? StatusEnum.Inactive : StatusEnum.Active, () => {
          closeAlert();
          setIsInactive((prev) => !prev);
        });
      },
    });
  }

  return (
    <Tooltip label={isInactive ? 'Hiển thị' : 'Ẩn'} hasArrow placement="top" shouldWrapChildren>
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
