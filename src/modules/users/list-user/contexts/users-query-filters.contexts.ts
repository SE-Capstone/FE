import { useCallback } from 'react';

import type { QueryListUserInput } from '../types';

import { createStoreContext } from '@/libs/utils';

interface IUsersQueryState {
  filters: QueryListUserInput;
}

const initialState: IUsersQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useUsersQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IUsersQueryState['filters']>) => {
      setState({
        filters: {
          ...state.filters,
          ...newFilters,
        },
      });
    },
    [setState, state]
  );

  return {
    usersQueryState: state,
    setUsersQueryState: setState,
    setUsersQueryFilterState: handleSetFilter,
    resetUsersQueryState: resetState,
  };
}

export { Provider as UsersQueryProvider, useUsersQueryFilterStateContext };
