import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IUser } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IToggleUserStatus {
  body: {
    userId: string;
  };
}

function mutation(req: IToggleUserStatus) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IUser>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.user.toggleStatus,
    data: body,
    isFormData: true,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert?: () => void;
}

export function useToggleUserStatusMutation({ configs, closeAlert }: Props = {}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.user.users.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.user.detail._def,
      });
      closeAlert && closeAlert();
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).UPDATE_SUCCESS,
      });
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
