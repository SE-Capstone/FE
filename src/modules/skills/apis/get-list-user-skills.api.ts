import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { ISkill } from '../types';
import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function query(userId: string) {
  return makeRequest<never, IResponseApi<ISkill[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.skills.listUserSkill(userId),
  });
}

export type QueryListUserSkillsFnType = typeof query;

export type UseGetListUserSkillsOptionsType = {
  configs?: Partial<QueryConfig<QueryListUserSkillsFnType, TErrorResponse>>;
  userId: string;
};

export function useGetListUserSkills(params: UseGetListUserSkillsOptionsType) {
  const { configs, userId } = params;
  const enabled = useMemo(() => !!userId, [userId]);
  const queryKey = useMemo(() => allQueryKeysStore.skill.listUserSkill(userId).queryKey, [userId]);

  const { data, ...queryInfo } = useQuery({
    enabled,
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () => query(userId),
    ...configs,
  });

  return { listSkill: data?.data || [], ...queryInfo };
}
