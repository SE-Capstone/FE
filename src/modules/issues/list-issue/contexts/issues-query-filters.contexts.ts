import { useCallback } from 'react';

import type { QueryListIssueInput } from '../types';
import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

interface IIssuesQueryState {
  filters: DeepPartial<QueryListIssueInput>;
}

const initialState: IIssuesQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useIssuesQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IIssuesQueryState['filters']>) => {
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
    issuesQueryState: state,
    setIssuesQueryState: setState,
    setIssuesQueryFilterState: handleSetFilter,
    resetIssuesQueryState: resetState,
  };
}

export { Provider as IssuesQueryProvider, useIssuesQueryFilterStateContext };
