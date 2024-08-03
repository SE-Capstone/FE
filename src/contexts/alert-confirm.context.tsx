import React from 'react';

import type { AlertDialogProps } from '@chakra-ui/react';

import { createStoreContext } from '@/libs/utils';

const initialState = {
  title: 'Xác nhận?' as React.ReactNode,
  description:
    `Bạn có chắc thực hiện hành động này? Bạn không thể hoàn tác hành động này sau đó.` as React.ReactNode,
  textConfirm: 'OK',
  type: 'error' as 'error' | 'info',
  isOpenAlert: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHandleConfirm() {},
  dialogProps: {} as Partial<AlertDialogProps>,
  isLoading: false,
};

type State = typeof initialState;

const { Provider: AlertDialogProvider, useStore } = createStoreContext(initialState);

function useAlertDialogStore(isLoading = false) {
  const [state, setState] = useStore((state) => state);

  const openAlert = React.useCallback(
    (newState: Partial<Omit<State, 'isOpenAlert'>>) => setState({ ...newState, isOpenAlert: true }),
    [setState]
  );

  const closeAlert = React.useCallback(() => {
    setState({ ...initialState, isOpenAlert: false });
  }, [setState]);

  React.useEffect(() => {
    setState({
      isLoading,
    });
  }, [isLoading, setState]);

  return {
    state,
    openAlert,
    closeAlert,
    setStateAlert: setState,
  };
}

export { AlertDialogProvider, useAlertDialogStore };
