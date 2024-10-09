import { useCallback } from 'react';

import type { QueryListPositionInput } from '../types';
import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

interface IPositionsQueryState {
  filters: DeepPartial<QueryListPositionInput>;
}

const initialState: IPositionsQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function usePositionsQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IPositionsQueryState['filters']>) => {
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
    positionsQueryState: state,
    setPositionsQueryState: setState,
    setPositionsQueryFilterState: handleSetFilter,
    resetPositionsQueryState: resetState,
  };
}

export { Provider as PositionsQueryProvider, usePositionsQueryFilterStateContext };
