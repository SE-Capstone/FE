import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type TaskCompletionByStatus = {
  status: string;
  percentage: number;
};

type OverviewProjectReport = {
  ongoingTasks: number;
  totalTasks: number;
  doneTasks: number;
  totalEffort: number;
  actualEffot: number;
  estimateEffort: number;
  overallCompletionRate: number;
  taskCompletionRate: TaskCompletionByStatus[];
};

interface IOverviewProjectReportRequest {
  body: {
    projectId: string;
    phaseId?: string;
    startDate?: Date | string;
    endDate?: Date | string;
  };
}

function query(req: IOverviewProjectReportRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<OverviewProjectReport>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.projects.projectOverview,
    data: body,
  });
}

export type QueryOverviewProjectReportFnType = typeof query;

export type UseGetOverviewProjectReportOptionsType = {
  configs?: Partial<QueryConfig<QueryOverviewProjectReportFnType, TErrorResponse>>;
  req: IOverviewProjectReportRequest;
};

export function useGetOverviewProjectReport(params: UseGetOverviewProjectReportOptionsType) {
  const { configs, req } = params;

  const currentParams = useMemo(() => req, [req]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.project['projects/reports/tasks/overview'].queryKey, currentParams],
    [currentParams]
  );

  const { data, ...queryInfo } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(req),
    ...configs,
  });

  return { overviewReport: data?.data, ...queryInfo };
}
