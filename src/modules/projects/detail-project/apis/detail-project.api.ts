import { useEffect, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IProject, ProjectMember } from '../../list-project/types';
import type { IResponseApi } from '@/configs/axios';

import { useProjectContext } from '@/contexts/project/project-context';
import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { useAuthentication } from '@/modules/profile/hooks';
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
  const { t } = useTranslation();
  const { setProjectContext } = useProjectContext();
  const { currentUser } = useAuthentication();
  const enabled = useMemo(() => !!projectId, [projectId]);
  const queryKey = useMemo(() => allQueryKeysStore.project.detail(projectId).queryKey, [projectId]);

  const { data, ...queryInfo } = useQuery({
    enabled,
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(projectId),
    ...configs,
  });

  useEffect(() => {
    const members: ProjectMember[] = [];
    const project = data?.data;

    project?.members?.map((member) =>
      members.push({
        id: member.id,
        fullName: member.fullName,
        userName:
          currentUser?.id === member.id
            ? `${member.userName} (${t('common.me')})`
            : member.userName,
        roleName: member.roleName,
        positionName: member.positionName,
        avatar: member.avatar || '',
      })
    );
    if (project?.leadId) {
      members.push({
        id: project.leadId,
        fullName: project.leadName || '',
        userName:
          currentUser?.id === project.leadId
            ? `${project.leadName} (${t('common.me')})`
            : project.leadName || '',
        roleName: 'Project lead',
        positionName: project.leadPosition || '',
        avatar: '',
      });
    }

    if (!members.find((member) => member.id === currentUser?.id)) {
      members.unshift({
        id: currentUser?.id || '',
        fullName: currentUser?.fullName || '',
        userName: `${currentUser?.userName} (${t('common.me')})` || '',
        roleName: currentUser?.roleName || '',
        positionName: currentUser?.positionName || '',
        avatar: currentUser?.avatar || '',
      });
    }

    setProjectContext({
      members,
      project: data?.data || null,
      projectId: data?.data?.id || '',
    });
  }, [data?.data, setProjectContext, currentUser, t]);

  return { project: data?.data, ...queryInfo };
}
