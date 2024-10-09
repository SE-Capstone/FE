import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { IPosition } from '../../types';
import type { QueryListPositionInput } from '../../types/positions.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IGetListPositionRequest {
  params?: DeepPartial<QueryListPositionInput>;
}

export function getListPositionRequest(req: IGetListPositionRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IPosition[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.positions.list,
    params,
  });
}

interface UseGetListPositionQueryProps {
  configs?: QueryConfig<typeof getListPositionRequest>;
  params?: DeepPartial<QueryListPositionInput>;
}

export function useGetListPositionQuery(props: UseGetListPositionQueryProps = {}) {
  const { configs, params } = props;

  const currentParams = useMemo(() => params, [params]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.position.positions.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListPositionRequest({
        params: currentParams,
      }),
    placeholderData: keepPreviousData,
    ...configs,
  });

  return {
    ...query,
    listPosition: query.data?.data || [],
  };
}
