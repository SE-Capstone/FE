import { useMemo } from 'react';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IUser } from '../../types';
import type { QueryListUserInput } from '../../types/users.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsGetInfiniteUser = IBaseQueryParams<QueryListUserInput>;

interface IGetInfiniteUserRequest {
  params: IParamsGetInfiniteUser;
}

export function getInfiniteUserRequest(req: IGetInfiniteUserRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IUser[]>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.user.listUser,
    data: params,
  });
}

interface UseGetInfiniteUserQueryProps {
  configs?: QueryConfig<typeof getInfiniteUserRequest>;
  params?: DeepPartial<QueryListUserInput>;
}

export function useGetInfiniteUserQuery(props: UseGetInfiniteUserQueryProps = {}) {
  const { pageIndex, pageSize, setPaginate } = usePaginateReq();
  const { configs, params } = props;

  const currentParams = useMemo(
    () =>
      merge(
        {
          pageIndex,
          pageSize,
          orderBy: 'createDate',
          orderByDesc: 'desc',
        },
        params
      ),
    [pageIndex, pageSize, params]
  );

  const queryKey = useMemo(
    () => [...allQueryKeysStore.user.users.queryKey, currentParams],
    [currentParams]
  );

  // @ts-ignore
  const { data, fetchNextPage, hasNextPage, ...query } = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getInfiniteUserRequest({
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
    listUser: data?.pages?.flatMap((page) => page.data) || [],
    hasMore: !!hasNextPage,
    fetchMore,
    handlePaginate,
  };
}
