import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IPosition } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IUpsertPositionRequest {
  body: {
    id?: string;
    title: string;
    description: string;
  };
}

function mutation(req: IUpsertPositionRequest, isUpdate = false) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IPosition>>({
    method: isUpdate ? 'PUT' : 'POST',
    url: isUpdate
      ? ALL_ENDPOINT_URL_STORE.positions.update
      : ALL_ENDPOINT_URL_STORE.positions.create,
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

export function useUpsertPositionMutation({ configs, reset, isUpdate, onClose }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req) => mutation(req, isUpdate),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.position.positions.queryKey,
      });
      notify({
        type: 'success',
        message: isUpdate ? DEFAULT_MESSAGE(t).UPDATE_SUCCESS : DEFAULT_MESSAGE(t).CREATE_SUCCESS,
      });
      reset && reset();
      onClose();
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
