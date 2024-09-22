import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IProject } from '../../types';
import type { QueryListProjectInput } from '../../types/projects.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { calculatePrevAndNext } from '@/libs/helpers';
import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsGetListProject = IBaseQueryParams<QueryListProjectInput>;

interface IGetListProjectRequest {
  params: IParamsGetListProject;
}

export const defaultFilterProjects: QueryListProjectInput = {
  search: undefined,
  status: undefined,
  isVisible: undefined,
};

export function getListProjectRequest(req: IGetListProjectRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IProject[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.projects.list,
    params,
  });
}

interface UseGetListProjectQueryProps {
  configs?: QueryConfig<typeof getListProjectRequest>;
  params?: DeepPartial<QueryListProjectInput>;
}

export function useGetListProjectQuery(props: UseGetListProjectQueryProps = {}) {
  const { pageIndex, pageSize, setPaginate } = usePaginateReq();
  const { configs, params } = props;

  const currentParams = useMemo(
    () =>
      merge(
        {
          pageIndex,
          pageSize,
          orderBy: 'createDate',
          orderByDesc: 'desc',
        },
        params
      ),
    [pageIndex, pageSize, params]
  );

  const queryKey = useMemo(
    () => [...allQueryKeysStore.project.projects.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListProjectRequest({
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
    listProject: query.data?.data || [],
    meta,
    handlePaginate,
  };
}
