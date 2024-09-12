import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IRole } from '../../list-role/types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function query(roleId: string) {
  return makeRequest<never, IResponseApi<IRole>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.roles.detail(roleId),
  });
}

export type QueryRoleFnType = typeof query;

export type UseGetRolesOptionsType = {
  configs?: QueryConfig<QueryRoleFnType, TErrorResponse>;
  roleId: string;
};

export function useGetRole(params: UseGetRolesOptionsType) {
  const { configs, roleId } = params;

  const queryKey = useMemo(() => allQueryKeysStore.role.detail(roleId).queryKey, [roleId]);

  const { data, ...queryInfo } = useQuery({
    queryKey,
    queryFn: () => query(roleId),
    ...configs,
  });

  return { role: data?.data || undefined, ...queryInfo };
}
