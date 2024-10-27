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

interface IRemovePhaseRequest {
  body: {
    id: string;
  };
}

function mutation(req: IRemovePhaseRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IPhase>>({
    method: 'DELETE',
    url: ALL_ENDPOINT_URL_STORE.phases.delete(body.id),
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
}

export function useRemovePhaseMutation(props: Props) {
  const { configs, closeAlert } = props;
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.phase.phases.queryKey,
      });
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).DELETE_SUCCESS,
      });
      closeAlert();
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
