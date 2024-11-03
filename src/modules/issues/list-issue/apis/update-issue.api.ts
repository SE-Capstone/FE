import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IUpdateIssueRequest {
  body: {
    id: string;
    labelId?: string;
    statusId?: string;
    title?: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    parentIssueId?: string;
    percentage?: number;
    priority?: number;
    assigneeId?: string;
    estimatedTime?: number;
  };
}

function mutation(req: IUpdateIssueRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.issues.update(body.id),
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
}

export function useUpdateIssueMutation({ configs }: IProps = {}) {
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
        queryKey: allQueryKeysStore.issue.issues.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue.detail._def,
      });

      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).UPDATE_SUCCESS,
      });
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(t, error) });
    },

    ...configs,
  });
}
