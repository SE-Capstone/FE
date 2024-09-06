import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IAuthUserLoginResponse } from '../types/auth.types';
import type { IResponseApi } from '@/configs/axios';
import type { ITokenStorage } from '@/libs/helpers';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { clearStoredAuth, getErrorMessage, notify, setStoredAuth } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { useAuth } from '@/modules/profile/hooks/auth-context';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface IAuthGoogleLoginRequest {
  body: {
    idToken: string;
  };
}

function authGoogleLoginRequest(req: IAuthGoogleLoginRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IAuthUserLoginResponse>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.auth.googleSignIn,
    data: body,
  });
}

interface IAuthGoogleLoginMutationProps {
  configs?: MutationConfig<typeof authGoogleLoginRequest>;
}

export function useGoogleLoginMutation({ configs }: IAuthGoogleLoginMutationProps = {}) {
  const navigate = useNavigate();
  const { handleInitializeLogin } = useAuth();

  return useMutation({
    mutationFn: authGoogleLoginRequest,

    onMutate() {
      clearStoredAuth();
    },
    onSuccess: (data) => {
      if (data.statusCode !== 200) {
        notify({ type: 'error', message: DEFAULT_MESSAGE.SOMETHING_WRONG });
        return;
      }
      const result = data?.data;
      handleInitializeLogin && handleInitializeLogin();

      setStoredAuth<ITokenStorage>({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        userId: result.userId,
        roleName: result.roleName,
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
