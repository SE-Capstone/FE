import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IRole } from '../../types';
import type { QueryListRoleInput } from '../../types/roles.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsGetListRole = QueryListRoleInput;

interface IGetListRoleRequest {
  params: IParamsGetListRole;
}

export const defaultFilterRoles: QueryListRoleInput = {};

export function getListRoleRequest(req: IGetListRoleRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IRole[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.roles.listRole,
    data: params,
  });
}

interface UseGetListRoleQueryProps {
  configs?: QueryConfig<typeof getListRoleRequest>;
  params?: DeepPartial<QueryListRoleInput>;
}

export function useGetListRoleQuery(props: UseGetListRoleQueryProps = {}) {
  const { configs, params } = props;

  const currentParams = useMemo(() => merge({}, params), [params]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.user.users.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListRoleRequest({
        params: currentParams,
      }),
    placeholderData: keepPreviousData,
    ...configs,
  });

  return {
    listRole: query.data?.data || [],
    ...query,
  };
}
