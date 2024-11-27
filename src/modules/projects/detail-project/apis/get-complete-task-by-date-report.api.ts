import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type TaskCompletionByDate = {
  period: string;
  completedTasks: number;
};

interface ITaskCompleteByDateReportRequest {
  body: {
    projectId: string;
    phaseId?: string;
    startDate: Date | string;
    endDate: Date | string;
  };
}

function query(req: ITaskCompleteByDateReportRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<TaskCompletionByDate[]>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.projects.completeTaskReportByDate,
    data: body,
  });
}

export type QueryTaskCompleteByDateReportFnType = typeof query;

export type UseGetTaskCompleteByDateReportOptionsType = {
  configs?: Partial<QueryConfig<QueryTaskCompleteByDateReportFnType, TErrorResponse>>;
  req: ITaskCompleteByDateReportRequest;
};

export function useGetTaskCompleteByDateReport(params: UseGetTaskCompleteByDateReportOptionsType) {
  const { configs, req } = params;

  const currentParams = useMemo(() => req, [req]);

  const queryKey = useMemo(
    () => [
      ...allQueryKeysStore.project['projects/reports/tasks/completion-chart'].queryKey,
      currentParams,
    ],
    [currentParams]
  );

  const { data, ...queryInfo } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(req),
    ...configs,
  });

  return { taskCompleteByDateData: data?.data, ...queryInfo };
}
