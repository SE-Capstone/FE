import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface IAuthCheckResetCodeRequest {
  body: {
    code: string;
  };
}

function authCheckResetCodeRequest(req: IAuthCheckResetCodeRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.auth.checkResetCode,
    data: body,
  });
}

interface IAuthLoginMutationProps {
  configs?: MutationConfig<typeof authCheckResetCodeRequest>;
}

export function useCheckResetCodeMutation({ configs }: IAuthLoginMutationProps = {}) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authCheckResetCodeRequest,

    onSuccess: () => {},

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(error) });
      navigate(APP_PATHS.login);
    },

    ...configs,
  });
}
