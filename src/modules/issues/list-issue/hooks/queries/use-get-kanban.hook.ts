import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';
import qs from 'qs';

import type { QueryKanbanInput } from '../../types/issues.types';
import type { IResponseApi } from '@/configs/axios';
import type { IKanban } from '@/modules/statuses/types';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsGetKanban = IBaseQueryParams<QueryKanbanInput>;

interface IGetKanbanRequest {
  params: IParamsGetKanban;
}

export function getKanbanRequest(req: IGetKanbanRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IKanban[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.issues.kanban,
    params,
    paramsSerializer: (params) => qs.stringify(params),
  });
}

interface UseGetKanbanQueryProps {
  configs?: QueryConfig<typeof getKanbanRequest>;
  params: DeepPartial<QueryKanbanInput>;
  projectId: string;
}

export function useGetKanbanQuery(props: UseGetKanbanQueryProps) {
  const { configs, params, projectId } = props;

  const currentParams = useMemo(
    () =>
      merge(
        {
          pageIndex: 1,
          pageSize: 10000,
          projectId,
        },
        params
      ),
    [params, projectId]
  );

  const queryKey = useMemo(
    () => [...allQueryKeysStore.issue['issues/kanban'].queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getKanbanRequest({
        params: currentParams,
      }),
    placeholderData: keepPreviousData,
    ...configs,
  });

  return {
    ...query,
    kanban: query.data?.data || [],
  };
}
