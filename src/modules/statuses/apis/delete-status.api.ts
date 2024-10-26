import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
    isDefault?: boolean;
  };
}

function mutation(req: IRemoveStatusRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IStatus>>({
    method: 'DELETE',
    url: body.isDefault
      ? ALL_ENDPOINT_URL_STORE.statuses.deleteDefault(body.id)
      : ALL_ENDPOINT_URL_STORE.statuses.delete(body.id),
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
  isDefault?: boolean;
}

export function useRemoveStatusMutation(props: Props) {
  const { configs, closeAlert, isDefault } = props;
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      if (isDefault) {
        queryClient.invalidateQueries({
          queryKey: allQueryKeysStore.status['statuses/default'].queryKey,
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: allQueryKeysStore.status.statuses.queryKey,
        });
      }
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
