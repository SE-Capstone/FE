import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { StatusReport } from '../../list-project/types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IStatusReportRequest {
  body: {
    projectId: string;
    phaseId?: string;
    startDate?: Date | string;
    endDate?: Date | string;
  };
}

function query(req: IStatusReportRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<StatusReport>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.projects.statusReport,
    data: body,
  });
}

export type QueryStatusReportFnType = typeof query;

export type UseGetStatusReportOptionsType = {
  configs?: Partial<QueryConfig<QueryStatusReportFnType, TErrorResponse>>;
  req: IStatusReportRequest;
};

export function useGetStatusReport(params: UseGetStatusReportOptionsType) {
  const { configs, req } = params;
  const currentParams = useMemo(() => req, [req]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.project['projects/reports/tasks'].queryKey, currentParams],
    [currentParams]
  );

  const { data, ...queryInfo } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(req),
    ...configs,
  });

  return { statusReport: data?.data, ...queryInfo };
}
