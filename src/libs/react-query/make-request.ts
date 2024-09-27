import { useEffect } from 'react';

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

import { API_URL, CustomHttpStatusCode, TIMEOUT } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

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

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: Array<FailedRequest> = [];

const RequestInterceptor = () => {
  const { handleLogin } = useAuthentication();

  useEffect(() => {
    const responseInterceptor = axiosClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes(ALL_ENDPOINT_URL_STORE.auth.logout)) {
          return Promise.reject(error);
        }

        if (
          (error.response?.status === 401 && !originalRequest._retry) ||
          error.response?.status === CustomHttpStatusCode.TOKEN_EXPIRED ||
          error.response?.status === CustomHttpStatusCode.ROLE_CHANGED
        ) {
          if (originalRequest._retry) {
            return Promise.reject(error); // Already retried, reject
          }
          originalRequest._retry = true;

          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            return Promise.reject(error);
          }

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const response = await axiosClient.post('/auth/refresh-token', {
                refreshToken,
              });
              const { accessToken, user } = response.data.data;

              // Store the new tokens
              setStoredAuth<ITokenStorage>({
                accessToken,
                refreshToken: response.data.data.refreshToken,
                user,
              });

              handleLogin(user);
              failedQueue.forEach((promise) => promise.resolve(accessToken));
              failedQueue = [];

              // Retry the original request with the new access token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return await axiosClient(originalRequest);
            } catch (err) {
              failedQueue.forEach((promise) => promise.reject(err as AxiosError));
              failedQueue = [];
              return await Promise.reject(err); // Reject if refresh fails
            } finally {
              isRefreshing = false; // Reset refreshing state
            }
          }

          // If already refreshing, return a promise that resolves when the refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (accessToken: string) => {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                resolve(axiosClient(originalRequest)); // Retry the request
              },
              reject: (err: AxiosError) => reject(err),
            });
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [handleLogin]);

  return null;
};

export default RequestInterceptor;
// axiosClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: any) => {
//     const originalRequest = error.config;

//     if (
//       (error.response?.status === 401 && !originalRequest?._retry) ||
//       error.response?.status === CustomHttpStatusCode.TOKEN_EXPIRED ||
//       error.response?.status === CustomHttpStatusCode.ROLE_CHANGED
//     ) {
//       if (originalRequest._retry) {
//         return Promise.reject(error); // Already retried, reject
//       }
//       originalRequest._retry = true;

//       const refreshToken = getRefreshToken();
//       if (!refreshToken) {
//         return Promise.reject(error);
//       }

//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           const response = await axiosClient.post('/auth/refresh-token', {
//             refreshToken,
//           });
//           const { accessToken, user } = response.data.data;

//           // Store the new tokens
//           setStoredAuth<ITokenStorage>({
//             accessToken,
//             refreshToken: response.data.data.refreshToken,
//             user,
//           });

//           // const { handleLogin } = useAuthentication();
//           // handleLogin(user);

//           failedQueue.forEach((promise) => promise.resolve(accessToken));
//           failedQueue = [];

//           // Retry the original request with the new access token
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           return await axiosClient(originalRequest);
//         } catch (err) {
//           failedQueue.forEach((promise) => promise.reject(err as AxiosError));
//           failedQueue = [];
//           return await Promise.reject(err); // Reject if refresh fails
//         } finally {
//           isRefreshing = false; // Reset refreshing state
//         }
//       }

//       // If already refreshing, return a promise that resolves when the refresh completes
//       return new Promise((resolve, reject) => {
//         failedQueue.push({
//           resolve: (accessToken: string) => {
//             originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//             resolve(axiosClient(originalRequest)); // Retry the request
//           },
//           reject: (err: AxiosError) => reject(err),
//         });
//       });
//     }

//     return Promise.reject(error);
//   }
// );

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
