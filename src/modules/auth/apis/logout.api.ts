import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IAuthLogoutResponse } from '../types/auth.types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { useAlertDialogStore } from '@/contexts';
import { clearStoredAuth, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
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

  const mutation = useMutation({
    mutationFn: logoutMutation,

    onMutate: () => {
      queryClient.clear();
      clearStoredAuth();
    },
    onError: async () => {
      notify({ type: 'error', message: 'Logout failed! Try Again' });
    },
    onSuccess: async () => {
      notify({ type: 'success', message: 'Logout successfully!' });
    },
    ...configs,
  });

  const { openAlert, closeAlert } = useAlertDialogStore();

  const handleLogout = () => {
    openAlert({
      title: 'Đăng xuất',
      description: 'Bạn có chắc chắn muốn đăng xuất?',
      onHandleConfirm() {
        mutation.mutate();
        closeAlert();
        navigate(APP_PATHS.login);
      },
    });
  };

  return {
    ...mutation,
    handleLogout,
  };
}
