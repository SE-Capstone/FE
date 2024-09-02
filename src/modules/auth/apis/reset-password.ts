import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface IAuthResetPasswordRequest {
  body: {
    code: string;
    newPassword: string;
    confirmPassword: string;
  };
}

function authResetPasswordRequest(req: IAuthResetPasswordRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.auth.resetPassword,
    data: body,
  });
}

interface IAuthLoginMutationProps {
  configs?: MutationConfig<typeof authResetPasswordRequest>;
}

export function useResetPasswordMutation({ configs }: IAuthLoginMutationProps = {}) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authResetPasswordRequest,

    onSuccess: () => {
      notify({
        type: 'success',
        message: `Reset password successfully`,
      });
      navigate(APP_PATHS.login);
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(error) });
    },

    ...configs,
  });
}
