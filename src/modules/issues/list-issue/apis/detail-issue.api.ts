import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IIssue } from '../types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function query(issueId: string) {
  return makeRequest<never, IResponseApi<IIssue>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.issues.detail(issueId),
  });
}

export type QueryDetailIssueFnType = typeof query;

export type UseGetDetailIssueOptionsType = {
  configs?: Partial<QueryConfig<QueryDetailIssueFnType, TErrorResponse>>;
  issueId: string;
};

export function useGetDetailIssue(params: UseGetDetailIssueOptionsType) {
  const { configs, issueId } = params;
  const enabled = useMemo(() => !!issueId, [issueId]);
  const queryKey = useMemo(() => allQueryKeysStore.issue.detail(issueId).queryKey, [issueId]);

  const { data, ...queryInfo } = useQuery({
    enabled,
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(issueId),
    ...configs,
  });

  return { issue: data?.data, ...queryInfo };
}
