import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IUpsertMembersRequest {
  body: {
    projectId: string;
    memberIds: string[];
  };
}

function mutation(req: IUpsertMembersRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.projects.upsertMembers,
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
}

export function useUpsertMembersMutation({ configs, reset }: IProps = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutation,

    onSuccess: (data) => {
      if (data.statusCode !== 204) {
        notify({ type: 'error', message: DEFAULT_MESSAGE.SOMETHING_WRONG });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project.detail._def,
      });

      reset && reset();

      notify({
        type: 'success',
        message: DEFAULT_MESSAGE.UPDATE_SUCCESS,
      });
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(error) });
    },

    ...configs,
  });
}
