import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { IStatus } from '../../types';
import type { QueryListStatusInput } from '../../types/statuses.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export function getListStatusRequest() {
  return makeRequest<never, IResponseApi<IStatus[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.statuses.listDefault,
  });
}

interface UseGetListStatusQueryProps {
  configs?: QueryConfig<typeof getListStatusRequest>;
  params?: DeepPartial<QueryListStatusInput>;
}

export function useGetListDefaultStatusQuery(props: UseGetListStatusQueryProps = {}) {
  const { configs, params } = props;

  const currentParams = useMemo(() => params, [params]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.status['statuses/default'].queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: getListStatusRequest,
    placeholderData: keepPreviousData,
    ...configs,
  });

  const refetch = () => {
    query.refetch();
  };

  return {
    ...query,
    refetch,
    listStatus: query.data?.data || [],
  };
}
