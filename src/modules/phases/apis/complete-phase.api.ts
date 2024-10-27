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

interface ICompletePhaseRequest {
  body: {
    projectId: string;
  };
}

function mutation(req: ICompletePhaseRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IPhase>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.phases.complete,
    params: {
      projectId: body.projectId,
    },
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
}

export function useCompletePhaseMutation(props: Props) {
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
