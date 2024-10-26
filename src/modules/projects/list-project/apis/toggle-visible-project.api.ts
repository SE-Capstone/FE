import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IProject } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function mutation(projectId: string) {
  return makeRequest<never, IResponseApi<IProject>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.projects.toggleVisible(projectId),
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert?: () => void;
}

export function useToggleVisibleProjectMutation({ configs, closeAlert }: Props = {}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: mutation,

    onSuccess: (data) => {
      if (data.statusCode !== 200) {
        notify({ type: 'error', message: DEFAULT_MESSAGE(t).SOMETHING_WRONG });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project.projects.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project.detail._def,
      });
      closeAlert && closeAlert();
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).UPDATE_SUCCESS,
      });
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
