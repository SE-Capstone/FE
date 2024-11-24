import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { QuerySkillsReportInput, SkillsReport } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface ISkillsReportRequest {
  body: QuerySkillsReportInput;
}

function queryRequest(req: ISkillsReportRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<SkillsReport[]>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.user.skillReport,
    data: body,
  });
}

export type QuerySkillsReportFnType = typeof queryRequest;

export type UseSkillsReportQueryProps = {
  configs?: QueryConfig<typeof queryRequest>;
  body: DeepPartial<QuerySkillsReportInput>;
};

export function useGetSkillsReport(props: UseSkillsReportQueryProps) {
  const { configs, body } = props;

  const currentParams = useMemo(() => body, [body]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.user['users/reports/skills'].queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey,
    queryFn: () =>
      queryRequest({
        body,
      }),
    ...configs,
  });

  return {
    ...query,
    data: query.data?.data || [],
  };
}
