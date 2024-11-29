import { useMemo } from 'react';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { INotification } from '../../types';
import type { IResponseApi } from '@/configs/axios';
import type { IBaseQueryParams } from '@/types';

import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsGetInfiniteNotification = IBaseQueryParams;

interface IGetInfiniteNotificationRequest {
  params: IParamsGetInfiniteNotification;
}

export function getInfiniteNotificationRequest(req: IGetInfiniteNotificationRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<INotification[]> & { unReadCount: number }>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.notifications.list,
    params,
  });
}

interface UseGetInfiniteNotificationQueryProps {
  configs?: QueryConfig<typeof getInfiniteNotificationRequest>;
}

export function useGetInfiniteNotificationQuery(props: UseGetInfiniteNotificationQueryProps = {}) {
  const { pageIndex, setPaginate } = usePaginateReq();
  const { configs } = props;

  const currentParams = useMemo(
    () =>
      merge({
        pageIndex,
        pageSize: 10,
      }),
    [pageIndex]
  );

  const queryKey = useMemo(
    () => [...allQueryKeysStore.notification['notifications/mine'].queryKey, currentParams],
    [currentParams]
  );

  // @ts-ignore
  const { data, fetchNextPage, hasNextPage, ...query } = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getInfiniteNotificationRequest({
        params: { ...currentParams, pageIndex: pageParam },
      }),
    getNextPageParam: (lastPage) =>
      (lastPage?.meta?.pageIndex || 0) < (lastPage?.meta?.totalPages || 0)
        ? (lastPage?.meta?.pageIndex || 1) + 1
        : undefined,
    select: (data) => ({
      ...data,
      pages: data.pages,
    }),
    throwOnError: false,
    retry: 3,
    retryDelay: 1000,
    placeholderData: keepPreviousData,
    ...configs,
  });

  function handlePaginate(pageIndex: number, pageSize: number) {
    setPaginate({ pageIndex, pageSize });
  }

  const fetchMore = () => {
    if (hasNextPage && fetchNextPage) {
      fetchNextPage();
    }
  };

  return {
    ...query,
    listNotification: data?.pages?.flatMap((page) => page.data) || [],
    unReadCount: data?.pages?.flatMap((page) => page.unReadCount)[0] || 0,
    hasMore: !!hasNextPage,
    fetchMore,
    handlePaginate,
  };
}
