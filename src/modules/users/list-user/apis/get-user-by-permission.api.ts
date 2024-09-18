import { useQuery } from '@tanstack/react-query';

import type { IUser } from '../types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function query(permissionName: string) {
  return makeRequest<never, IResponseApi<IUser[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.user.getByPermission,
    params: {
      permissionName,
    },
  });
}

export type QueryUsersByPermissionFnType = typeof query;

export type UseGetUsersByPermissionOptionsType = {
  configs?: QueryConfig<QueryUsersByPermissionFnType, TErrorResponse>;
  permissionName: string;
};

export function useGetUsersByPermission(params: UseGetUsersByPermissionOptionsType) {
  const { configs, permissionName } = params;
  const { data, ...queryInfo } = useQuery({
    queryKey: allQueryKeysStore.user['users/get-by-permission'].queryKey,
    queryFn: () => query(permissionName),
    ...configs,
  });

  return { users: data?.data || [], ...queryInfo };
}
