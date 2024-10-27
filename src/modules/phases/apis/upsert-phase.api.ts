import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IPhase } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IUpsertPhaseRequest {
  body: {
    title: string;
    description?: string;
    expectedStartDate: string;
    expectedEndDate: string;
    projectId: string;
  };
}

function mutation(req: IUpsertPhaseRequest, id?: string, isUpdate = false) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IPhase>>({
    method: isUpdate ? 'PUT' : 'POST',
    url: isUpdate
      ? ALL_ENDPOINT_URL_STORE.phases.update(id || '')
      : ALL_ENDPOINT_URL_STORE.phases.create,
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
  onClose: () => void;
  id?: string;
  isUpdate?: boolean;
  isDefault?: boolean;
}

export function useUpsertPhaseMutation({ configs, reset, id, isUpdate, onClose }: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (req) => mutation(req, id, isUpdate),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.phase.phases.queryKey,
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
