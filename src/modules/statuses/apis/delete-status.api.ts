import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IStatus } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IRemoveStatusRequest {
  body: {
    id: string;
    newStatusId?: string;
  };
}

function mutation(req: IRemoveStatusRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IStatus>>({
    method: 'DELETE',
    url: ALL_ENDPOINT_URL_STORE.statuses.delete(body.id),
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
}

export function useRemoveStatusMutation(props: Props) {
  const { configs, closeAlert } = props;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.status.statuses.queryKey,
      });
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE.DELETE_SUCCESS,
      });
      closeAlert();
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
