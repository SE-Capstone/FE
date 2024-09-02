import { useMutation } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface IAuthForgotPasswordRequest {
  body: {
    email: string;
  };
}

function authForgotPasswordRequest(req: IAuthForgotPasswordRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.auth.forgotPassword,
    data: body,
  });
}

interface IAuthLoginMutationProps {
  configs?: MutationConfig<typeof authForgotPasswordRequest>;
  reset?: () => void;
}

export function useForgotPasswordMutation({ configs, reset }: IAuthLoginMutationProps = {}) {
  return useMutation({
    mutationFn: authForgotPasswordRequest,

    onSuccess: () => {
      reset && reset();
      notify({
        type: 'success',
        message: `Submit request successfully. Please check your email and follow instruction to reset password`,
      });
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(error) });
    },

    ...configs,
  });
}
