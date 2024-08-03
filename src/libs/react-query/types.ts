import type { IResponseErrorApi } from '@/configs/axios';
import type { AnyFunction, ExtractFnReturnType, GetDeepProp, Pretty } from '@/types';
import type { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export type TErrorResponse<TError = any> = GetDeepProp<
  NonNullable<AxiosError<TError>['response']>,
  'data'
> & { statusCode?: number };

export type QueryConfig<QueryFnType extends (...args: any) => any, TError = any> = UseQueryOptions<
  ExtractFnReturnType<QueryFnType>,
  TErrorResponse<TError>
> & {
  queryKey: QueryKey;
};

// export type OldMutationConfig<MutationFnType extends (...args: any) => any, TError = any> = Omit<
//   UseMutationOptions<
//     ExtractFnReturnType<MutationFnType>,
//     TErrorResponse<TError>,
//     Parameters<MutationFnType>[0]
//   >,
//   'mutationFn'
// >;

export type MutationConfig<
  MutationFnType extends AnyFunction = AnyFunction,
  TError = IResponseErrorApi
> = UseMutationOptions<
  Pretty<ExtractFnReturnType<MutationFnType>>,
  TErrorResponse<Pretty<TError>>,
  0 extends Parameters<MutationFnType>['length'] ? void : Parameters<MutationFnType>[0]
>;
