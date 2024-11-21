import { useCallback } from 'react';

import type { QueryKanbanInput } from '../types';
import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

interface IKanbanQueryState {
  filters: DeepPartial<QueryKanbanInput>;
}

const initialState: IKanbanQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useKanbanQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IKanbanQueryState['filters']>) => {
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
    kanbanQueryState: state,
    setKanbanQueryState: setState,
    setKanbanQueryFilterState: handleSetFilter,
    resetKanbanQueryState: resetState,
  };
}

export { Provider as KanbanQueryProvider, useKanbanQueryFilterStateContext };
