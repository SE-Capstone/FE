import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IJob } from '../../types';
import type { QueryListJobInput } from '../../types/jobs.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { calculatePrevAndNext } from '@/libs/helpers';
import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IGetListJobRequest {
  params?: DeepPartial<QueryListJobInput>;
}

export function getListJobRequest(req: IGetListJobRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IJob[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.jobs.list,
    params,
  });
}

interface UseGetListJobQueryProps {
  configs?: QueryConfig<typeof getListJobRequest>;
  params?: DeepPartial<QueryListJobInput>;
}

export function useGetListJobQuery(props: UseGetListJobQueryProps = {}) {
  const { pageIndex, pageSize, setPaginate } = usePaginateReq();
  const { configs, params } = props;

  const currentParams = useMemo(
    () =>
      merge(
        {
          pageIndex,
          pageSize,
          orderBy: 'createdAt',
        },
        params
      ),
    [pageIndex, pageSize, params]
  );

  const queryKey = useMemo(
    () => [...allQueryKeysStore.job.jobs.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListJobRequest({
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
    listJob: query.data?.data || [],
    meta,
    handlePaginate,
  };
}
