import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { IApplicant } from '../../types';
import type { QueryListApplicantInput } from '../../types/applicants.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { calculatePrevAndNext } from '@/libs/helpers';
import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsGetListApplicant = IBaseQueryParams<QueryListApplicantInput>;

interface IGetListApplicantRequest {
  params: IParamsGetListApplicant;
}

export function getListApplicantRequest(req: IGetListApplicantRequest) {
  const { params } = req;
  return makeRequest<typeof params, IResponseApi<IApplicant[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.applicants.list,
    params,
  });
}

interface UseGetListApplicantQueryProps {
  configs?: QueryConfig<typeof getListApplicantRequest>;
  params?: DeepPartial<QueryListApplicantInput>;
}

export function useGetListApplicantQuery(props: UseGetListApplicantQueryProps = {}) {
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
    () => [...allQueryKeysStore.applicant.applicants.queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getListApplicantRequest({
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
    listApplicant: query.data?.data || [],
    meta,
    handlePaginate,
  };
}
