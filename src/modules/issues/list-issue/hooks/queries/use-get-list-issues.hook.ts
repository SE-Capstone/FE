import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IIssue } from '../../types';
import type { QueryListIssueInput } from '../../types/issues.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { calculatePrevAndNext } from '@/libs/helpers';
import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsGetListIssue = IBaseQueryParams<QueryListIssueInput>;

interface IGetListIssueRequest {
  params: IParamsGetListIssue;
}

export function getListIssueRequest(req: IGetListIssueRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IIssue[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.issues.list,
    params,
  });
}

interface UseGetListIssueQueryProps {
  configs?: QueryConfig<typeof getListIssueRequest>;
  params?: DeepPartial<QueryListIssueInput>;
}

export function useGetListIssueQuery(props: UseGetListIssueQueryProps = {}) {
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
    () => [...allQueryKeysStore.issue.issues.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListIssueRequest({
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
    listIssue: query.data?.data || [],
    meta,
    handlePaginate,
  };
}
