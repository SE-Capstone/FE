import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IPermission {
  id: string;
  name: string;
}

export interface IGroupPermission {
  id: string;
  name: string;
  permissions: IPermission[];
}

function query() {
  return makeRequest<never, IResponseApi<IGroupPermission[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.permissions.listPermission,
  });
}

export type QueryGroupPermissionsFnType = typeof query;

export type UseGetGroupPermissionsOptionsType = {
  configs?: QueryConfig<QueryGroupPermissionsFnType, TErrorResponse>;
};

export function useGetGroupPermissions({ configs }: UseGetGroupPermissionsOptionsType = {}) {
  const { data, ...queryInfo } = useQuery({
    queryKey: allQueryKeysStore.permission['group-permissions'].queryKey,
    placeholderData: keepPreviousData,
    queryFn: query,
    ...configs,
  });

  return { groupPermissions: data?.data || [], ...queryInfo };
}
