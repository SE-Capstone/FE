import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { UserStatistics } from '../../list-project/types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function queryRequest() {
  return makeRequest<never, IResponseApi<UserStatistics[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.user.userForSuggest,
  });
}

export type QuerySkillsReportFnType = typeof queryRequest;

export type UseSkillsReportQueryProps = {
  configs?: QueryConfig<typeof queryRequest>;
};

export function useGetSkillsReport(props: UseSkillsReportQueryProps = {}) {
  const { configs } = props;

  const queryKey = useMemo(() => [...allQueryKeysStore.user['users/reports/skills'].queryKey], []);

  const query = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: queryRequest,
    ...configs,
  });

  return {
    ...query,
    memberForSuggest: query.data?.data || [],
  };
}
