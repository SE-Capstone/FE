import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';
import type { ThemingProps } from '@chakra-ui/react';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IUpdateRoleRequest {
  body: {
    id: string;
    name: string;
    color: ThemingProps['colorScheme'];
    description: string;
    permissionsId: string[];
  };
}

function mutation(req: IUpdateRoleRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<void>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.roles.update,
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
  onClose?: () => void;
}

export function useUpdateRoleMutation({ configs, onClose }: IProps = {}) {
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
        queryKey: allQueryKeysStore.role.roles.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.role.detail._def,
      });
      // queryClient.invalidateQueries({
      //   queryKey: allQueryKeysStore.permission['group-permissions'].queryKey,
      // });

      onClose && onClose();

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
