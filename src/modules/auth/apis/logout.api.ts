import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Connector from '../../notifications/widgets/signalR-connection';
// import Connector as ConntectorKanban from '../../issues/list-issue/widgets/signalR-connection';

import type { IAuthLogoutResponse } from '../types/auth.types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser, resetAuthContext } = useAuthentication();
  const connector = Connector(currentUser?.id || '');
  const mutation = useMutation({
    mutationFn: logoutMutation,

    onMutate: () => {
      connector.disconnect();
      queryClient.clear();
    },
    onError: async () => {
      resetAuthContext();
      // error.statusCode === CustomHttpStatusCode.TOKEN_EXPIRED ||
      // !error.statusCode ||
      // error.message === 'Invalid refresh token'
      //   ? notify({ type: 'success', message: t('messages.logoutSuccess') })
      //   : notify({ type: 'error', message: DEFAULT_MESSAGE(t).SOMETHING_WRONG });
      notify({ type: 'success', message: t('messages.logoutSuccess') });
      navigate(APP_PATHS.login);
    },
    onSuccess: async () => {
      resetAuthContext();
      notify({ type: 'success', message: t('messages.logoutSuccess') });
      navigate(APP_PATHS.login);
    },
    ...configs,
  });

  const { openAlert, closeAlert } = useAlertDialogStore(false);

  const handleLogout = () => {
    openAlert({
      title: t('common.logout'),
      description: t('messages.confirmLogout'),
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
