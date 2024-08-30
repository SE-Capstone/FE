import { useQuery } from '@tanstack/react-query';

import { banks } from '../banks';

import type { IResponseApi } from '@/configs/axios';

import { makeRequest, type QueryConfig, type TErrorResponse } from '@/libs/react-query';

export interface IBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
}

export interface BanksResponse {
  code: string;
  desc: string;
  data: IBank[];
}
function query() {
  return makeRequest<never, IResponseApi<BanksResponse>>({
    method: 'GET',
    url: 'https://api.vietqr.io/v2/banks',
  });
}

export type QueryBanksFnType = typeof query;

export type UseGetBanksOptionsType = {
  configs?: QueryConfig<QueryBanksFnType, TErrorResponse>;
};

export function useGetBanks({ configs }: UseGetBanksOptionsType = {}) {
  const { data, isSuccess } = useQuery({
    queryKey: ['banks'],
    queryFn: query,
    ...configs,
  });

  if (!isSuccess) {
    return { banks: banks.data };
  }

  return { banks: data?.data.data || banks.data, isSuccess };
}
