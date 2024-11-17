import { useCallback } from 'react';

import type { QueryListRoleInput } from '../types';
import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

interface IRolesQueryState {
  filters: DeepPartial<QueryListRoleInput>;
}

const initialState: IRolesQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useRolesQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IRolesQueryState['filters']>) => {
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
    rolesQueryState: state,
    setRolesQueryState: setState,
    setRolesQueryFilterState: handleSetFilter,
    resetRolesQueryState: resetState,
  };
}

export { Provider as RolesQueryProvider, useRolesQueryFilterStateContext };
