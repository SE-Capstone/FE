import { useMemo } from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { ILabel } from '../../types';
import type { QueryListLabelInput } from '../../types/labels.types';
import type { IResponseApi } from '@/configs/axios';
import type { DeepPartial } from '@/types';

import { makeRequest, type QueryConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export function getListLabelRequest() {
  return makeRequest<never, IResponseApi<ILabel[]>>({
    method: 'GET',
    url: ALL_ENDPOINT_URL_STORE.labels.listDefault,
  });
}

interface UseGetListLabelQueryProps {
  configs?: QueryConfig<typeof getListLabelRequest>;
  params?: DeepPartial<QueryListLabelInput>;
}

export function useGetListDefaultLabelQuery(props: UseGetListLabelQueryProps = {}) {
  const { configs, params } = props;

  const currentParams = useMemo(() => params, [params]);

  const queryKey = useMemo(
    () => [...allQueryKeysStore.label['labels/default'].queryKey, currentParams],
    [currentParams]
  );

  const query = useQuery({
    queryKey,
    queryFn: getListLabelRequest,
    placeholderData: keepPreviousData,
    ...configs,
  });

  return {
    ...query,
    listLabel: query.data?.data || [],
  };
}
