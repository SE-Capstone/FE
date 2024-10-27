import { useCallback } from 'react';

import type { QueryListSkillInput } from '../types';
import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

interface ISkillsQueryState {
  filters: DeepPartial<QueryListSkillInput>;
}

const initialState: ISkillsQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useSkillsQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<ISkillsQueryState['filters']>) => {
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
    skillsQueryState: state,
    setSkillsQueryState: setState,
    setSkillsQueryFilterState: handleSetFilter,
    resetSkillsQueryState: resetState,
  };
}

export { Provider as SkillsQueryProvider, useSkillsQueryFilterStateContext };
