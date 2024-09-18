import { useCallback } from 'react';

import type { QueryListProjectInput } from '../types';
import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

interface IProjectsQueryState {
  filters: DeepPartial<QueryListProjectInput>;
}

const initialState: IProjectsQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useProjectsQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IProjectsQueryState['filters']>) => {
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
    projectsQueryState: state,
    setProjectsQueryState: setState,
    setProjectsQueryFilterState: handleSetFilter,
    resetProjectsQueryState: resetState,
  };
}

export { Provider as ProjectsQueryProvider, useProjectsQueryFilterStateContext };
