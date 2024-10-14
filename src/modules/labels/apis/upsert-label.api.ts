import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ILabel } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IUpsertLabelRequest {
  body: {
    title: string;
    description?: string;
    projectId: string;
  };
}

function mutation(req: IUpsertLabelRequest, id?: string, isUpdate = false) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<ILabel>>({
    method: isUpdate ? 'PUT' : 'POST',
    url: isUpdate
      ? ALL_ENDPOINT_URL_STORE.labels.update(id || '')
      : ALL_ENDPOINT_URL_STORE.labels.create,
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
  onClose: () => void;
  id?: string;
  isUpdate?: boolean;
}

export function useUpsertLabelMutation({ configs, reset, id, isUpdate, onClose }: Props) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req) => mutation(req, id, isUpdate),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.label.labels.queryKey,
      });
      notify({
        type: 'success',
        message: isUpdate ? DEFAULT_MESSAGE.UPDATE_SUCCESS : DEFAULT_MESSAGE.CREATE_SUCCESS,
      });
      reset && reset();
      onClose();
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
