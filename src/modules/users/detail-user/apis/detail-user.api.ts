import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IUser } from '../../list-user/types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function query(userId: string) {
  return makeRequest<never, IResponseApi<IUser>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.user.detail(userId),
  });
}

export type QueryDetailUserFnType = typeof query;

export type UseGetDetailUserOptionsType = {
  configs?: QueryConfig<QueryDetailUserFnType, TErrorResponse>;
  userId: string;
};

export function useGetDetailUser(params: UseGetDetailUserOptionsType) {
  const { configs, userId } = params;
  const enabled = useMemo(() => !!userId, [userId]);
  const queryKey = useMemo(() => allQueryKeysStore.user.detail(userId).queryKey, [userId]);

  const { data, ...queryInfo } = useQuery({
    enabled,
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(userId),
    ...configs,
  });

  return { user: data?.data, ...queryInfo };
}
