import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IUser } from '../../types';
import type { QueryListUserInput } from '../../types/users.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { calculatePrevAndNext } from '@/libs/helpers';
import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsGetListUser = IBaseQueryParams<QueryListUserInput>;

interface IGetListUserRequest {
  params: IParamsGetListUser;
}

export const defaultFilterUsers: QueryListUserInput = {
  fullName: undefined,
  roleId: undefined,
  status: undefined,
};

export function getListUserRequest(req: IGetListUserRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IUser[]>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.user.listUser,
    data: params,
  });
}

interface UseGetListUserQueryProps {
  configs?: QueryConfig<typeof getListUserRequest>;
  params?: DeepPartial<QueryListUserInput>;
}

export function useGetListUserQuery(props: UseGetListUserQueryProps = {}) {
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

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListUserRequest({
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
    listUser: query.data?.data || [],
    meta,
    handlePaginate,
  };
}
