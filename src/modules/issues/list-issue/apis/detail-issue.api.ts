import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { IIssue } from '../types';
import type { IResponseApi } from '@/configs/axios';

import { notify } from '@/libs/helpers';
import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { APP_PATHS } from '@/routes/paths/app.paths';
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
  const { t } = useTranslation();
  const enabled = useMemo(() => !!issueId, [issueId]);
  const navigate = useNavigate();
  const queryKey = useMemo(() => allQueryKeysStore.issue.detail(issueId).queryKey, [issueId]);

  const { data, isError, ...queryInfo } = useQuery({
    enabled,
    placeholderData: (previousData) => previousData,
    queryKey,
    throwOnError: false,
    queryFn: () => query(issueId),
    ...configs,
  });

  if (isError) {
    notify({
      type: 'error',
      message: t('messages.issueNotFound'),
    });
    navigate(APP_PATHS.HOME);
  }

  return { issue: data?.data, isError, ...queryInfo };
}
