import { HttpStatusCode } from 'axios';

import type { TErrorResponse } from './types';
import type { DefaultOptions } from '@tanstack/react-query';

import { isProduction } from '@/configs';
import { getAccessToken, logger, notify } from '@/libs/helpers';

const staleTime = isProduction ? 1 * 60 * 1000 : 3 * 60 * 1000;

function queryErrorHandler(error: TErrorResponse): void {
  const accessToken = getAccessToken();
  const id = 'react-query-error';
  const titleError =
    error instanceof Error
      ? error.toString().replace(/^Error:\s*/, '') // remove the initial 'Error: ' that accompanies many errors
      : 'error connecting to server';

  if (error.statusCode === HttpStatusCode.Forbidden) {
    notify({ type: 'error', message: 'Unauthorized' });
  }
  // handle refresh token here
  // if (error?.statusCode === 401 && accessToken) {
  //   console.log('error: ', error);
  //   // void refreshTokenFn();
  //   window.location.href = '/auth';
  //   notify({ type: 'error', message: 'Please, Sign in again!' });
  // }
  logger.debug('🚀 ~ Query onError:', { id, titleError, accessToken });
}

const defaultOptions: DefaultOptions<TErrorResponse> = {
  queries: {
    // onError: queryErrorHandler,
    throwOnError: true,
    staleTime,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  },
  mutations: {
    onError: queryErrorHandler,
  },
};

export const queryClientOptions = {
  defaultOptions,
} as const;
