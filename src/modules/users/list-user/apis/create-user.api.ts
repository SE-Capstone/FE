import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IUser } from '../types';
import type { GenderEnum } from '@/configs';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface ICreateUserRequest {
  body: {
    email: string;
    password: string;
    userName: string;
    fullName: string;
    address: string;
    gender: GenderEnum;
    dob: Date | string;
    phone: string;
    roleId: string;
  };
}

function mutation(req: ICreateUserRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IUser>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.user.createUser,
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
}

export function useCreateUserMutation({ configs, reset }: Props = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: (data) => {
      if (data.statusCode !== 200) {
        notify({ type: 'error', message: DEFAULT_MESSAGE.SOMETHING_WRONG });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.user.users.queryKey,
      });
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE.CREATE_SUCCESS,
      });
      reset && reset();
    },

    onError(error) {
      notify({
        type: 'error',
        message: getErrorMessage(error),
      });
    },

    ...configs,
  });
}
