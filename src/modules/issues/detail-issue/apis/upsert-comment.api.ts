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

interface IUpsertCommentRequest {
  body: {
    issueId: string;
    content: string;
  };
}

function mutation(req: IUpsertCommentRequest, id?: string, isUpdate = false) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IComment>>({
    method: isUpdate ? 'PUT' : 'POST',
    url: isUpdate
      ? ALL_ENDPOINT_URL_STORE.comments.update(id || '')
      : ALL_ENDPOINT_URL_STORE.comments.create,
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
  id?: string;
  isUpdate?: boolean;
}

export function useUpsertCommentMutation({ configs, reset, id, isUpdate }: Props = {}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (req) => mutation(req, id, isUpdate),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue.detail._def,
      });

      notify({
        type: 'success',
        message: isUpdate ? DEFAULT_MESSAGE(t).UPDATE_SUCCESS : DEFAULT_MESSAGE(t).CREATE_SUCCESS,
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
