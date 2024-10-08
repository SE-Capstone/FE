import { useCallback } from 'react';

import type { QueryListJobInput } from '../types';
import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

interface IJobsQueryState {
  filters: DeepPartial<QueryListJobInput>;
}

const initialState: IJobsQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useJobsQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IJobsQueryState['filters']>) => {
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
    jobsQueryState: state,
    setJobsQueryState: setState,
    setJobsQueryFilterState: handleSetFilter,
    resetJobsQueryState: resetState,
  };
}

export { Provider as JobsQueryProvider, useJobsQueryFilterStateContext };
