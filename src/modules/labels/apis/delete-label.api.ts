import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ILabel } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IRemoveLabelRequest {
  body: {
    id: string;
    newLabelId?: string;
  };
}

function mutation(req: IRemoveLabelRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<ILabel>>({
    method: 'DELETE',
    url: ALL_ENDPOINT_URL_STORE.labels.delete(body.id),
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
}

export function useRemoveLabelMutation(props: Props) {
  const { configs, closeAlert } = props;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.label.labels.queryKey,
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
