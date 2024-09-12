import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { GenderEnum } from '@/configs';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IUpdateUserRequest {
  body: {
    id: string;
    address: string;
    fullName: string;
    gender: GenderEnum;
    dob: Date | string;
    phone: string;
    roleId?: string;
  };
}

function mutation(req: IUpdateUserRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.user.updateUser,
    data: body,
    isFormData: true,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
}

export function useUpdateUserMutation({ configs }: IProps = {}) {
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
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.user.detail._def,
      });

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
