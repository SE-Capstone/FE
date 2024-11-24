import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { merge } from 'lodash-es';

import type { QuerySkillsReportInput, SkillsReport } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial, IBaseQueryParams } from '@/types';

import { usePaginateReq } from '@/libs/hooks/use-paginate';
import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export type IParamsSkillsReport = IBaseQueryParams<QuerySkillsReportInput>;

interface ISkillsReportRequest {
  params: IParamsSkillsReport;
}

function query(req: ISkillsReportRequest) {
  const { params } = req;
  return makeRequest<never, IResponseApi<SkillsReport[]>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.user.skillReport,
    params,
  });
}

export type QuerySkillsReportFnType = typeof query;

export type UseSkillsReportQueryProps = {
  configs?: QueryConfig<typeof query>;
  params?: DeepPartial<QuerySkillsReportInput>;
};

export function useGetSkillsReport(props: UseSkillsReportQueryProps = {}) {
  const { pageIndex, pageSize } = usePaginateReq();
  const { configs, params } = props;

  const currentParams = useMemo(
    () =>
      merge(
        {
          pageIndex,
          pageSize,
        },
        params
      ),
    [pageIndex, pageSize, params]
  );

  const queryKey = useMemo(
    () => [...allQueryKeysStore.user['users/reports/skills'].queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () =>
      query({
        params: currentParams,
      }),
    ...configs,
  });

  return {
    ...query,
    data: query.data?.data || [],
  };
}
