import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { ISkill } from '../../types';
import type { QueryListSkillInput } from '../../types/skills.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { calculatePrevAndNext } from '@/libs/helpers';
import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IGetListSkillRequest {
  params?: DeepPartial<QueryListSkillInput>;
}

export function getListSkillRequest(req: IGetListSkillRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<ISkill[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.skills.list,
    params,
  });
}

interface UseGetListSkillQueryProps {
  configs?: QueryConfig<typeof getListSkillRequest>;
  params?: DeepPartial<QueryListSkillInput>;
}

export function useGetListSkillQuery(props: UseGetListSkillQueryProps = {}) {
  const { pageIndex, pageSize, setPaginate } = usePaginateReq();
  const { configs, params } = props;

  const currentParams = useMemo(
    () =>
      merge(
        {
          pageIndex,
          pageSize,
          orderBy: 'createdAt',
        },
        params
      ),
    [pageIndex, pageSize, params]
  );

  const queryKey = useMemo(
    () => [...allQueryKeysStore.skill.skills.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListSkillRequest({
        params: currentParams,
      }),
    placeholderData: keepPreviousData,
    ...configs,
  });

  const { prev, next } = calculatePrevAndNext(
    pageIndex,
    pageSize,
    query.data?.meta?.totalPages,
    query.data?.meta?.totalCount
  );

  const meta = {
    ...query.data?.meta,
    prev,
    next,
  };

  function handlePaginate(pageIndex: number, pageSize: number) {
    setPaginate({ pageIndex, pageSize });
  }

  return {
    ...query,
    listSkill: query.data?.data || [],
    meta,
    handlePaginate,
  };
}
