import { useMutation } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface IChangePasswordRequest {
  body: {
    userId: string;
    newPassword: string;
    confirmPassword: string;
  };
}

function mutation(req: IChangePasswordRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<{}>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.auth.adminChangePassword,
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
}

export function useAdminChangePasswordMutation({ configs, reset }: IProps = {}) {
  return useMutation({
    mutationFn: mutation,

    onSuccess: (data) => {
      if (data.statusCode !== 204) {
        notify({ type: 'error', message: DEFAULT_MESSAGE.SOMETHING_WRONG });
        return;
      }
      reset && reset();
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE.UPDATE_SUCCESS,
      });
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(error) });
    },
    ...configs,
  });
}
