import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IAuthLogoutResponse } from '../types/auth.types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import { notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

function logoutMutation() {
  return makeRequest<null, IResponseApi<IAuthLogoutResponse>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.auth.logout,
  });
}

interface IAuthLogoutMutationProps {
  configs?: MutationConfig<typeof logoutMutation>;
}

export function useLogoutMutation({ configs }: IAuthLogoutMutationProps = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { resetAuthContext } = useAuthentication();

  const mutation = useMutation({
    mutationFn: logoutMutation,

    onMutate: () => {
      queryClient.clear();
    },
    onError: async () => {
      resetAuthContext();
      notify({ type: 'error', message: DEFAULT_MESSAGE.SOMETHING_WRONG });
      navigate(APP_PATHS.login);
    },
    onSuccess: async () => {
      resetAuthContext();
      notify({ type: 'success', message: 'Logout successfully!' });
      navigate(APP_PATHS.login);
    },
    ...configs,
  });

  const { openAlert, closeAlert } = useAlertDialogStore();

  const handleLogout = () => {
    openAlert({
      title: 'Logout',
      description: 'Are you sure to logout?',
      onHandleConfirm() {
        mutation.mutate();
        closeAlert();
      },
    });
  };

  return {
    ...mutation,
    handleLogout,
  };
}
