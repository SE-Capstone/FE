import { useQuery } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IRole {
  id: string;
  name: string;
  permissionsIds: string[];
}

function query() {
  return makeRequest<never, IResponseApi<IRole[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.roles.listRole,
  });
}

export type QueryRolesFnType = typeof query;

export type UseGetRolesOptionsType = {
  configs?: QueryConfig<QueryRolesFnType, TErrorResponse>;
};

export function useGetRoles({ configs }: UseGetRolesOptionsType = {}) {
  const { data, ...queryInfo } = useQuery({
    queryKey: allQueryKeysStore.role.roles.queryKey,
    queryFn: query,
    ...configs,
  });

  return { roles: data?.data || [], ...queryInfo };
}
