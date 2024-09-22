import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ProjectStatusEnum } from '../../list-project/types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IUpdateProjectRequest {
  body: {
    id: string;
    name: string;
    code: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    status: ProjectStatusEnum;
    isVisible: boolean;
    leadId?: string;
  };
}

function mutation(req: IUpdateProjectRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.projects.update(req.body.id),
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
}

export function useUpdateProjectMutation({ configs }: IProps = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutation,

    onSuccess: (data) => {
      if (data.statusCode !== 200) {
        notify({ type: 'error', message: DEFAULT_MESSAGE.SOMETHING_WRONG });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project.projects.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project.detail._def,
      });

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
