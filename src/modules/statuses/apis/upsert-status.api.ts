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

interface IUpsertStatusRequest {
  body: {
    name: string;
    description?: string;
    color: string;
    isDone?: boolean;
    projectId: string;
  };
}

function mutation(req: IUpsertStatusRequest, id?: string, isUpdate = false, isDefault = false) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IStatus>>({
    method: isUpdate ? 'PUT' : 'POST',
    url: isUpdate
      ? isDefault
        ? ALL_ENDPOINT_URL_STORE.statuses.updateDefault(id || '')
        : ALL_ENDPOINT_URL_STORE.statuses.update(id || '')
      : isDefault
      ? ALL_ENDPOINT_URL_STORE.statuses.createDefault
      : ALL_ENDPOINT_URL_STORE.statuses.create,
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
  isNotReload?: boolean;
}

export function useUpsertStatusMutation({
  configs,
  reset,
  id,
  isUpdate,
  isDefault,
  isNotReload,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (req) => mutation(req, id, isUpdate, isDefault),

    onSuccess: () => {
      if (isDefault) {
        !isNotReload &&
          queryClient.invalidateQueries({
            queryKey: allQueryKeysStore.status['statuses/default'].queryKey,
          });
      } else {
        !isNotReload &&
          queryClient.invalidateQueries({
            queryKey: allQueryKeysStore.status.statuses.queryKey,
          });
        queryClient.invalidateQueries({
          queryKey: allQueryKeysStore.issue['issues/kanban'].queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: allQueryKeysStore.issue.issues.queryKey,
        });
      }
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
