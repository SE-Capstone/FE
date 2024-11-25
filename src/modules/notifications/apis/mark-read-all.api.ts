import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { MutationConfig } from '@/libs/react-query';

import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function mutation() {
  return makeRequest<never, never>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.notifications.readAll,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
}

export function useMarkReadAllMutation(props: Props) {
  const { t } = useTranslation();
  const { configs } = props;

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.notification['notifications/mine'].queryKey,
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
