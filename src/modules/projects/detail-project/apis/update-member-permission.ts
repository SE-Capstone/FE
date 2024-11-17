import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IUpdateMemberPermissionRequest {
  body: {
    isProjectConfigurator: boolean;
    isIssueConfigurator: boolean;
    isCommentConfigurator: boolean;
  };
}

function mutation(req: IUpdateMemberPermissionRequest, projectId: string, memberId: string) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.projects.updateMemberPermission(projectId, memberId),
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
  closeAlert: () => void;
  projectId: string;
  memberId: string;
}

export function useUpdateMemberPermissionMutation({
  configs,
  closeAlert,
  projectId,
  memberId,
}: IProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req) => mutation(req, projectId, memberId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.project.detail._def,
      });

      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).UPDATE_SUCCESS,
      });

      closeAlert();
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(t, error) });
    },

    ...configs,
  });
}
