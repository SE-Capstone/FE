import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface ICreateRoleRequest {
  body: {
    name: string;
    description: string;
    permissionsId: string[];
  };
}

function mutation(req: ICreateRoleRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.roles.create,
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
}

export function useCreateRoleMutation({ configs, reset }: IProps = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: mutation,

    onSuccess: (data) => {
      if (data.statusCode !== 200) {
        notify({ type: 'error', message: DEFAULT_MESSAGE(t).SOMETHING_WRONG });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.role.roles.queryKey,
      });

      reset && reset();
      navigate(APP_PATHS.listRole);
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).CREATE_SUCCESS,
      });
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(t, error) });
    },

    ...configs,
  });
}
