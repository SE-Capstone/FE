import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { UserStatistics } from '../../list-project/types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IUserForSuggestRequest {
  body: {
    userInProject: string[];
  };
}

function queryRequest(req: IUserForSuggestRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<UserStatistics[]>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.user.userForSuggest,
    data: body,
  });
}

export type QueryUserForSuggestFnType = typeof queryRequest;

export type UseUserForSuggestQueryProps = {
  configs?: QueryConfig<typeof queryRequest>;
  userInProject: string[];
};

export function useGetUserForSuggest(props: UseUserForSuggestQueryProps) {
  const { configs, userInProject } = props;

  const queryKey = useMemo(() => [...allQueryKeysStore.user['users/active'].queryKey], []);

  const query = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () =>
      queryRequest({
        body: {
          userInProject,
        },
      }),
    ...configs,
  });

  return {
    ...query,
    memberForSuggest: query.data?.data || [],
  };
}
