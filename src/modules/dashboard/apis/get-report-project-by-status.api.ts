import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';
import type { ProjectStatusEnum } from '@/modules/projects/list-project/types';
import type { DeepPartial } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type QueryReportProjectsByStatusInput = {
  year?: number;
};

export type ReportProjectsByStatus = {
  status: ProjectStatusEnum;
  count: number;
};

interface IReportProjectsByStatusRequest {
  params: QueryReportProjectsByStatusInput;
}

function queryRequest(req: IReportProjectsByStatusRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<ReportProjectsByStatus[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.dashboard.projectByStatus,
    params,
  });
}

export type QueryReportProjectsByStatusFnType = typeof queryRequest;

export type UseReportProjectsByStatusQueryProps = {
  configs?: QueryConfig<typeof queryRequest>;
  params: DeepPartial<QueryReportProjectsByStatusInput>;
};

export function useGetReportProjectsByStatus(props: UseReportProjectsByStatusQueryProps) {
  const { configs, params } = props;

  const currentParams = useMemo(() => params, [params]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.dashboard['dashboard/projects-by-year'].queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () =>
      queryRequest({
        params,
      }),
    ...configs,
  });

  return {
    ...query,
    data: query.data?.data || [],
  };
}
