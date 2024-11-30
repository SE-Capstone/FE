import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';

import { PermissionEnum } from '@/configs';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { useAuthentication } from '@/modules/profile/hooks';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type ReportUserOverview = {
  totalSkills: number;
  totalTasks: number;
  totalCurrentTasks: number;
  totalTasksDone: number;
  totalProjects: number;
  totalProjectsLead: number;
  totalCurrentProjects: number;
};

function queryRequest(id: string) {
  return makeRequest<never, IResponseApi<ReportUserOverview>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.dashboard.userOverview(id),
  });
}

export type QueryReportUserOverviewFnType = typeof queryRequest;

export type UseReportUserOverviewQueryProps = {
  configs?: QueryConfig<typeof queryRequest>;
};

export function useGetReportUserOverview(props: UseReportUserOverviewQueryProps) {
  const { configs } = props;
  const { currentUser, permissions } = useAuthentication();

  const queryKey = useMemo(
    () => [...allQueryKeysStore.dashboard.userOverview(currentUser?.id || '').queryKey],
    [currentUser?.id]
  );

  const query = useQuery({
    enabled: !permissions[PermissionEnum.VIEW_DASHBOARD],
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => queryRequest(currentUser?.id || ''),
    ...configs,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
