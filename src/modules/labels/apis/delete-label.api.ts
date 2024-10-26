import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
    isDefault?: boolean;
  };
}

function mutation(req: IRemoveLabelRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<ILabel>>({
    method: 'DELETE',
    url: body.isDefault
      ? ALL_ENDPOINT_URL_STORE.labels.deleteDefault(body.id)
      : ALL_ENDPOINT_URL_STORE.labels.delete(body.id),
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
  isDefault?: boolean;
}

export function useRemoveLabelMutation(props: Props) {
  const { t } = useTranslation();
  const { configs, closeAlert, isDefault } = props;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      if (isDefault) {
        queryClient.invalidateQueries({
          queryKey: allQueryKeysStore.label['labels/default'].queryKey,
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: allQueryKeysStore.label.labels.queryKey,
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
