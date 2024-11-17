import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IComment } from '../../list-issue/types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function mutation(id: string) {
  return makeRequest<never, IResponseApi<IComment>>({
    method: 'DELETE',
    url: ALL_ENDPOINT_URL_STORE.comments.delete(id),
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
}

export function useRemoveCommentMutation(props: Props) {
  const { t } = useTranslation();
  const { configs, closeAlert } = props;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue.detail._def,
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