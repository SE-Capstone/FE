import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { IListPhase, QueryListPhaseInput } from '../../types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IGetListPhaseRequest {
  params?: DeepPartial<QueryListPhaseInput>;
}

export function getListPhaseRequest(req: IGetListPhaseRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IListPhase>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.phases.list,
    params,
  });
}

interface UseGetListPhaseQueryProps {
  configs?: QueryConfig<typeof getListPhaseRequest>;
  params?: DeepPartial<QueryListPhaseInput>;
}

export function useGetListPhaseQuery(props: UseGetListPhaseQueryProps = {}) {
  const { configs, params } = props;

  const currentParams = useMemo(() => params, [params]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.phase.phases.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListPhaseRequest({
        params: currentParams,
      }),
    placeholderData: keepPreviousData,
    ...configs,
  });

  const refetch = () => {
    query.refetch();
  };

  return {
    ...query,
    refetch,
    listPhase: query.data?.data.phases || [],
    phaseStatus: query.data?.data.status || 0,
  };
}
