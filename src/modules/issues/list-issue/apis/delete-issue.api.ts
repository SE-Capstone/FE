import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import type { IIssue } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

function mutation(id: string) {
  return makeRequest<never, IResponseApi<IIssue>>({
    method: 'DELETE',
    url: ALL_ENDPOINT_URL_STORE.issues.delete(id),
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
}

export function useRemoveIssueMutation(props: Props) {
  const { t } = useTranslation();
  const { configs, closeAlert } = props;
  const { issueId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue.issues.queryKey,
      });
      if (issueId) {
        navigate(-1);
      }
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue.detail._def,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue['issues/kanban'].queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project['projects/reports/tasks'].queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project['projects/reports/tasks/overview'].queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project['projects/reports/tasks/completion-chart'].queryKey,
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
