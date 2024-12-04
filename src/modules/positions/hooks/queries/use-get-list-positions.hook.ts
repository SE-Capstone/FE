import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IPosition } from '../../types';
import type { QueryListPositionInput } from '../../types/positions.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { calculatePrevAndNext } from '@/libs/helpers';
import { usePaginateReq } from '@/libs/hooks/use-paginate';
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
  size?: number;
}

export function useGetListPositionQuery(props: UseGetListPositionQueryProps = {}) {
  const { pageIndex, pageSize, setPaginate } = usePaginateReq();
  const { configs, params, size } = props;

  const currentParams = useMemo(
    () =>
      merge(
        {
          pageIndex,
          pageSize: size || pageSize,
          orderByDesc: 'createdAt',
        },
        params
      ),
    [pageIndex, pageSize, params, size]
  );

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
    listPosition: query.data?.data || [],
    meta,
    handlePaginate,
  };
}
