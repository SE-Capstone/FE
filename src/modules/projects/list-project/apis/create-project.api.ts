import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IProject, ProjectStatusEnum } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface ICreateProjectRequest {
  body: {
    name: string;
    code: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    status?: ProjectStatusEnum;
    isVisible?: boolean;
    leadId?: string;
  };
}

function mutation(req: ICreateProjectRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IProject>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.projects.create,
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
}

export function useCreateProjectMutation({ configs, reset }: Props = {}) {
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
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE.CREATE_SUCCESS,
      });
      reset && reset();
    },

    onError(error) {
      notify({
        type: 'error',
        message: getErrorMessage(error),
      });
    },

    ...configs,
  });
}
