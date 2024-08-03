import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IAuthUserLoginResponse } from '../types/auth.types';
import type { IResponseApi } from '@/configs/axios';
import type { ITokenStorage } from '@/libs/helpers';
import type { MutationConfig } from '@/libs/react-query';

import { clearStoredAuth, notify, setStoredAuth } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface IAuthLoginRequest {
  body: {
    phone: string;
  };
}

function authLoginRequest(req: IAuthLoginRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IAuthUserLoginResponse>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.auth.signIn,
    data: body,
  });
}

interface IAuthLoginMutationProps {
  configs?: MutationConfig<typeof authLoginRequest>;
}

export function useLoginMutation({ configs }: IAuthLoginMutationProps = {}) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authLoginRequest,

    onMutate() {
      clearStoredAuth();
    },
    onSuccess: (data) => {
      if (data.statusCode !== 200) {
        notify({ type: 'error', message: 'Something went wrong!' });
        return;
      }
      const result = data?.data;

      setStoredAuth<ITokenStorage>({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      navigate(APP_PATHS.HOME);
    },

    onError(error) {
      notify({ type: 'error', message: error?.message });
      if (error.statusCode === 401) {
        clearStoredAuth();
      }
    },

    ...configs,
  });
}
