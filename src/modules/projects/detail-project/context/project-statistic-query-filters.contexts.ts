import { useCallback } from 'react';

import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

export type QueryProjectStatisticInput = {
  phaseId?: string;
  startDate?: string;
  endDate?: string;
};

interface IProjectStatisticQueryState {
  filters: DeepPartial<QueryProjectStatisticInput>;
}

const initialState: IProjectStatisticQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useProjectStatisticQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IProjectStatisticQueryState['filters']>) => {
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
    projectStatisticQueryState: state,
    setProjectStatisticQueryState: setState,
    setProjectStatisticQueryFilterState: handleSetFilter,
    resetProjectStatisticQueryState: resetState,
  };
}

export { Provider as ProjectStatisticQueryProvider, useProjectStatisticQueryFilterStateContext };
