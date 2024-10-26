import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IIssue } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface ICreateIssueRequest {
  body: {
    projectId: string;
    labelId: string;
    statusId: string;
    subject: string;
    description?: string;
    startDate: string;
    dueDate: string;
    parentIssueId?: string;
    percentage?: number;
    priority: number;
    assigneeId: string;
    estimatedTime?: number;
  };
}

function mutation(req: ICreateIssueRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IIssue>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.issues.create,
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
}

export function useCreateIssueMutation({ configs, reset }: Props = {}) {
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
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).CREATE_SUCCESS,
      });
      reset && reset();
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
