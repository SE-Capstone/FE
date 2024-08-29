import { useMemo, useState } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IUser } from '../../types';
import type { QueryListUserInput } from '../../types/users.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

const FAKE_META = {
  currentPage: 1,
  lastPage: 6,
  next: 2,
  perPage: 1,
  prev: null,
  total: 6,
};

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
          paginate: {
            pageSize,
            pageIndex,
          },
          filter: {
            search,
            status,
          },
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

  function handlePaginate(pageIndex: number, pageSize: number) {
    setPaginate({ pageIndex, pageSize });
  }

  return {
    ...query,
    pageIndex,
    pageSize,
    listUser: query.data?.data || [],
    meta: FAKE_META,
    search,
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
