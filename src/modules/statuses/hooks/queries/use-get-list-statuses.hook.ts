import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { IStatus } from '../../types';
import type { QueryListStatusInput } from '../../types/statuses.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IGetListStatusRequest {
  params?: DeepPartial<QueryListStatusInput>;
}

export function getListStatusRequest(req: IGetListStatusRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IStatus[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.statuses.list,
    params,
  });
}

interface UseGetListStatusQueryProps {
  configs?: QueryConfig<typeof getListStatusRequest>;
  params?: DeepPartial<QueryListStatusInput>;
}

export function useGetListStatusQuery(props: UseGetListStatusQueryProps = {}) {
  const { configs, params } = props;

  const currentParams = useMemo(() => params, [params]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.status.statuses.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListStatusRequest({
        params: currentParams,
      }),
    placeholderData: keepPreviousData,
    ...configs,
  });

  return {
    ...query,
    listStatus: query.data?.data || [],
  };
}
