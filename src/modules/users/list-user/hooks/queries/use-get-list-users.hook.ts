import { useMemo, useState } from 'react';

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

interface Filter {
  search: string;
  role: string;
  status: string;
}

export type IParamsGetListUser = IBaseQueryParams<Filter>;

interface IGetListUserRequest {
  params: IParamsGetListUser;
}

export const defaultFilterUsers: QueryListUserInput = {
  search: undefined,
  phone: undefined,
  role: undefined,
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
  defaultParams?: DeepPartial<IParamsGetListUser>;
}
// TODO: fix file
export function useGetListUserQuery(props: UseGetListUserQueryProps = {}) {
  const { pageIndex, pageSize, setPaginate } = usePaginateReq();
  const { configs, defaultParams } = props;

  const [search, setSearch] = useState(undefined);
  const [status, setStatus] = useState(undefined);

  function onChangeDebounce(newValue) {
    setSearch(newValue);
  }

  function changeStatus(tStatus) {
    setStatus(tStatus);
  }

  const currentParams = useMemo(
    () =>
      merge(
        {
          status,
          pageIndex,
          search,
          pageSize,
          orderBy: 'createDate',
          orderByDesc: 'desc',
        },
        defaultParams
      ),
    [pageIndex, pageSize, search, status, defaultParams]
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
    onChangeDebounce,
    changeStatus,
    handlePaginate,
  };

  // const hasMoreUsers = useMemo(
  //   () => !!listUsersMeta.next && listUsersMeta.currentPage !== listUsersMeta.lastPage,
  //   [listUsersMeta.currentPage, listUsersMeta.lastPage, listUsersMeta.next]
  // );

  // return {
  //   listUsersData,
  //   listUsersMeta,
  //   hasMoreUsers,
  //   fetchMore,
  //   variables,
  //   handlePaginateListUsers,
  //   ...restGetListUsersQuery,
  // };
}
