import { useQueryClient } from '@tanstack/react-query';

import type { InvalidateQueryFilters, QueryKey, Updater } from '@tanstack/react-query';

export const useOptimisticUpdate = <TDataCache>(key: QueryKey) => {
  const queryClient = useQueryClient();

  const prevData = queryClient.getQueryData<TDataCache>(key);

  const setDataToCache = (newData: Updater<TDataCache | undefined, TDataCache | undefined>) =>
    queryClient.setQueryData(key, newData);

  const invalidateQueries = (filter?: InvalidateQueryFilters) =>
    queryClient.invalidateQueries(filter);

  const cancelQueries = () => queryClient.cancelQueries({ queryKey: key });

  return { cancelQueries, prevData, setDataToCache, invalidateQueries };
};
