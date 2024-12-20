import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';

import { PermissionEnum } from '@/configs';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { useAuthentication } from '@/modules/profile/hooks';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type ReportOverview = {
  ongoingTasks: number;
  totalTasks: number;
  totalProjects: number;
  totalProjectsDone: number;
  totalSkillsEmployee: number;
  totalEmployee: number;
};

function queryRequest() {
  return makeRequest<never, IResponseApi<ReportOverview>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.dashboard.overview,
  });
}

export type QueryReportOverviewFnType = typeof queryRequest;

export type UseReportOverviewQueryProps = {
  configs?: QueryConfig<typeof queryRequest>;
};

export function useGetReportOverview(props: UseReportOverviewQueryProps) {
  const { configs } = props;
  const { permissions } = useAuthentication();

  const queryKey = useMemo(
    () => [...allQueryKeysStore.dashboard['dashboard/overview'].queryKey],
    []
  );

  const query = useQuery({
    enabled: !!permissions[PermissionEnum.VIEW_DASHBOARD],
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: queryRequest,
    ...configs,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
