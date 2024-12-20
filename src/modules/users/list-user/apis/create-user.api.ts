import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
    roleId?: string;
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
  const { t } = useTranslation();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.user.users.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.dashboard['dashboard/overview'].queryKey,
      });
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).CREATE_SUCCESS,
      });
      reset && reset();
    },

    onError(error) {
      notify({
        type: 'error',
        message: getErrorMessage(t, error),
      });
    },

    ...configs,
  });
}
