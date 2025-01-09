import { useMemo } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IIssueDash } from '../widgets/card-stat.widget';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { calculatePrevAndNext } from '@/libs/helpers';
import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type QueryMyTaskInput = {
  userId: string;
  isTaskDone?: boolean;
};

export type IParamsGetMyTask = IBaseQueryParams<QueryMyTaskInput>;

interface IGetMyTaskRequest {
  params: IParamsGetMyTask;
}

function queryRequest(req: IGetMyTaskRequest) {
  const { params } = req;
  return makeRequest<never, IResponseApi<IIssueDash[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.dashboard.myTask,
    params,
  });
}

export type QueryMyTaskFnType = typeof queryRequest;

export type UseMyTaskQueryProps = {
  configs?: QueryConfig<typeof queryRequest>;
  params: DeepPartial<QueryMyTaskInput>;
};

export function useGetMyTasks(props: UseMyTaskQueryProps) {
  const { pageIndex, pageSize, setPaginate } = usePaginateReq();
  const { configs, params } = props;

  const currentParams = useMemo(
    () =>
      merge(
        {
          pageIndex,
          pageSize,
        },
        params
      ),
    [pageIndex, pageSize, params]
  );

  const queryKey = useMemo(
    () => [...allQueryKeysStore.dashboard['dashboard/my-task'].queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      queryRequest({
        params: currentParams,
      }),
    placeholderData: keepPreviousData,
    ...configs,
  });

  const { prev, next } = calculatePrevAndNext(
    pageIndex,
    pageSize,
    query.data?.meta?.totalPages,
    query.data?.meta?.totalCount
  );

  const meta = {
    ...query.data?.meta,
    prev,
    next,
  };

  function handlePaginate(pageIndex: number, pageSize: number) {
    setPaginate({ pageIndex, pageSize });
  }

  return {
    ...query,
    myTasks: query.data?.data || [],
    meta,
    handlePaginate,
  };
}
