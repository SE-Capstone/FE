import { useCallback } from 'react';

import type { QueryListApplicantInput } from '../types';
import type { DeepPartial } from '@/types';

import { createStoreContext } from '@/libs/utils';

interface IApplicantsQueryState {
  filters: DeepPartial<QueryListApplicantInput>;
}

const initialState: IApplicantsQueryState = {
  filters: {},
};

const { Provider, useStore } = createStoreContext(initialState);

function useApplicantsQueryFilterStateContext() {
  const [state, setState, resetState] = useStore((store) => store);

  const handleSetFilter = useCallback(
    (newFilters: Partial<IApplicantsQueryState['filters']>) => {
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
    applicantsQueryState: state,
    setApplicantsQueryState: setState,
    setApplicantsQueryFilterState: handleSetFilter,
    resetApplicantsQueryState: resetState,
  };
}

export { Provider as ApplicantsQueryProvider, useApplicantsQueryFilterStateContext };
