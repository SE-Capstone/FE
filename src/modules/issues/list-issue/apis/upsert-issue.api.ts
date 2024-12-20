import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import type { IIssue } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IUpsertIssueRequest {
  body: {
    projectId: string;
    labelId?: string;
    statusId: string;
    title: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    actualDate?: string;
    parentIssueId?: string;
    percentage?: number;
    priority?: number;
    phaseId?: string;
    assigneeId?: string;
    reporterId?: string;
    estimatedTime?: number;
    actualTime?: number;
  };
}

function mutation(req: IUpsertIssueRequest, id?: string, isUpdate = false) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IIssue>>({
    method: isUpdate ? 'PUT' : 'POST',
    url: isUpdate
      ? ALL_ENDPOINT_URL_STORE.issues.update(id || '')
      : ALL_ENDPOINT_URL_STORE.issues.create,
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
  id?: string;
  isUpdate?: boolean;
  isRedirect?: boolean;
}

export function useUpsertIssueMutation({ configs, reset, id, isUpdate, isRedirect }: Props = {}) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (req) => mutation(req, id, isUpdate),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue.issues.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue['issues/kanban'].queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.issue.detail._def,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.status.statuses.queryKey,
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

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.dashboard['dashboard/overview'].queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.dashboard.userOverview._def,
      });

      notify({
        type: 'success',
        message: isUpdate ? DEFAULT_MESSAGE(t).UPDATE_SUCCESS : DEFAULT_MESSAGE(t).CREATE_SUCCESS,
      });

      if (isRedirect) {
        data.data.id
          ? navigate(APP_PATHS.detailIssue(projectId || '', data.data.id))
          : navigate(-1);
        //   isUpdate
        //     ? navigate(APP_PATHS.detailIssue(projectId || '', data.data.id))
        //     : navigate(APP_PATHS.listIssue(projectId || ''));
      }
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
