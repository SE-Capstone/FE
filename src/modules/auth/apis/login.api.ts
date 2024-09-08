import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IAuthUserLoginResponse } from '../types/auth.types';
import type { IResponseApi } from '@/configs/axios';
import type { ITokenStorage } from '@/libs/helpers';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { clearStoredAuth, getErrorMessage, notify, setStoredAuth } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface IAuthLoginRequest {
  body: {
    email: string;
    password: string;
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
  const { handleLogin } = useAuthentication();

  return useMutation({
    mutationFn: authLoginRequest,

    onMutate() {
      clearStoredAuth();
    },
    onSuccess: (data) => {
      if (data.statusCode !== 200) {
        notify({ type: 'error', message: DEFAULT_MESSAGE.SOMETHING_WRONG });
        return;
      }
      const result = data?.data;
      handleLogin(result.user);

      setStoredAuth<ITokenStorage>({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });

      notify({
        type: 'success',
        message: `Login successfully`,
      });
      navigate(APP_PATHS.HOME);
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(error) });
      if (error.statusCode === 401) {
        clearStoredAuth();
      }
    },

    ...configs,
  });
}
