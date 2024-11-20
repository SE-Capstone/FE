import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';
import type { ProjectMember } from '@/modules/projects/list-project/types';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function query(projectId: string) {
  return makeRequest<never, IResponseApi<ProjectMember[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.projects.members(projectId),
  });
}

export type QueryProjectMembersFnType = typeof query;

export type UseGetProjectMembersOptionsType = {
  configs?: Partial<QueryConfig<QueryProjectMembersFnType, TErrorResponse>>;
  projectId: string;
};

export function useGetProjectMembers(params: UseGetProjectMembersOptionsType) {
  const { configs, projectId } = params;
  const enabled = useMemo(() => !!projectId, [projectId]);
  const queryKey = useMemo(
    () => allQueryKeysStore.project.members(projectId).queryKey,
    [projectId]
  );

  const { data, ...queryInfo } = useQuery({
    enabled,
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(projectId),
    ...configs,
  });

  return { listMember: data?.data, ...queryInfo };
}
