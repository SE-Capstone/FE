import axios, { HttpStatusCode } from 'axios';

import {
  clearStoredAuth,
  getAccessToken,
  getRefreshToken,
  logger,
  notify,
  setStoredAuth,
} from '../helpers';

import type { ITokenStorage } from '../helpers';
import type { IResponseErrorApi } from '@/configs/axios';
import type { IBaseResponse, UnionAndString } from '@/types';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

import { API_URL, TIMEOUT } from '@/configs';

logger.info('API_URL: ', API_URL);

export const baseURL = `${API_URL}/api/`;

export const axiosClient = axios.create({
  baseURL,
  timeout: TIMEOUT * 1000,
  timeoutErrorMessage: '🚧🚧🚧 Server connection time out! Try later.',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    responseEncoding: 'utf8',
    responseType: 'json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Access-Control-Allow-Origin': '*',
    'X-Application': 'web app',
    'X-Version': '1.0.1',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = getRefreshToken();
      if (!refresh_token) {
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        return axiosClient
          .post('/refresh-token', { refresh_token })
          .then((response: AxiosResponse<ITokenStorage>) => {
            isRefreshing = false;
            const retryOriginalRequest = (config: AxiosRequestConfig) => {
              const configWithToken: AxiosRequestConfig = {
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${response.data.accessToken}`,
                },
              };

              setStoredAuth(response.data);

              return axiosClient(configWithToken);
            };

            failedQueue.forEach((callback) => callback(retryOriginalRequest));
            failedQueue = [];
            return retryOriginalRequest(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      return new Promise((resolve) => {
        failedQueue.push((config: AxiosRequestConfig) => {
          resolve(axiosClient(config));
        });
      });
    }

    return Promise.reject(error);
  }
);

interface IMakeRequestOptions<TDataReq> extends Omit<AxiosRequestConfig<TDataReq>, 'method'> {
  method: UnionAndString<Uppercase<Method>>;
  url: string | undefined;
  isFormData?: boolean;
}

export const makeRequest = async <TDataReq = any, TDataRes = any, TDataErr = IResponseErrorApi>(
  options: IMakeRequestOptions<TDataReq>
) => {
  const accessToken = await getAccessToken();
  // axiosClient.defaults.withCredentials = true;  //if using cookies
  const { isFormData = false, ...axiosOptions } = options;
  logger.debug('Axios options', JSON.stringify(options));

  const onSuccess = (response: AxiosResponse<TDataRes>) => {
    logger.debug('Response API:', JSON.stringify(response));

    return {
      ...response.data,
      statusCode: response.status,
    };
  };

  const onError = (error: AxiosError<TDataErr>) => {
    logger.error('Axios error:', JSON.stringify(error?.response?.data));

    if (error?.response?.status === HttpStatusCode.Unauthorized && accessToken) {
      window.location.href = '/auth';
      clearStoredAuth();
      notify({ type: 'error', message: 'Please, Sign in again!' });
    }

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      ...error.response?.data,
      statusCode: error?.response?.status,
    });
  };

  const headers = isFormData
    ? { ...axiosOptions.headers, 'Content-Type': 'multipart/form-data' }
    : axiosOptions.headers;

  return axiosClient({
    ...options,
    method: options.method as Method,
    ...(accessToken && { headers: { ...headers, Authorization: `Bearer ${accessToken}` } }),
  })
    .then(onSuccess)
    .catch(onError);
};

export async function getPipeData<T>(promise: Promise<IBaseResponse<T>>): Promise<T> {
  return promise.then((res) => res.data);
}
