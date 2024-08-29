import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { ICurrentUserResponse } from '../types';
import type { IResponseApi } from '@/configs/axios';

import { getAccessToken } from '@/libs/helpers';
import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function query() {
  return makeRequest<never, IResponseApi<ICurrentUserResponse>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.user.currentUserInfo,
  });
}

export type QueryCurrentUserFnType = typeof query;

export type UseGetCurrentUserOptionsType = {
  configs?: QueryConfig<QueryCurrentUserFnType, TErrorResponse>;
};

export function useGetCurrentUser({ configs }: UseGetCurrentUserOptionsType = {}) {
  const token = getAccessToken();
  const { data, ...queryInfo } = useQuery({
    enabled: !!token,
    placeholderData: (previousData) => previousData,
    queryKey: allQueryKeysStore.user['user/profile'].queryKey,
    queryFn: query,
    ...configs,
  });

  const user = useMemo(() => data?.data, [data?.data]);

  return { user, ...queryInfo };
}

export function useCheckAuthentication() {
  const token = getAccessToken();

  const { user, ...restQueryInfo } = useGetCurrentUser();

  const isLogged = useMemo(() => !!token && !!user, [token, user]);

  return { isLogged, ...restQueryInfo };
}
