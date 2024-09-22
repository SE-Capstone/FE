import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IProject } from '../../list-project/types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function query(projectId: string) {
  return makeRequest<never, IResponseApi<IProject>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.projects.detail(projectId),
  });
}

export type QueryDetailProjectFnType = typeof query;

export type UseGetDetailProjectOptionsType = {
  configs?: Partial<QueryConfig<QueryDetailProjectFnType, TErrorResponse>>;
  projectId: string;
};

export function useGetDetailProject(params: UseGetDetailProjectOptionsType) {
  const { configs, projectId } = params;
  const enabled = useMemo(() => !!projectId, [projectId]);
  const queryKey = useMemo(() => allQueryKeysStore.project.detail(projectId).queryKey, [projectId]);

  const { data, ...queryInfo } = useQuery({
    enabled,
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(projectId),
    ...configs,
  });

  return { project: data?.data, ...queryInfo };
}
