import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { UserStatistics } from '../../list-project/types';
import type { IResponseApi } from '@/configs/axios';

import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest, type MutationConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface ISuggestMemberRequest {
  body: {
    projectName: string;
    projectDetail: string;
    userStatistics: UserStatistics[];
  };
}

export function mutation(req: ISuggestMemberRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<string[]>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.projects.suggestMember,
    data: body,
  });
}

interface UseSuggestMemberQueryProps {
  configs?: MutationConfig<typeof mutation>;
  onOpen: () => void;
}

export function useSuggestMemberMutation(props: UseSuggestMemberQueryProps) {
  const { t } = useTranslation();
  const { configs, onOpen } = props;

  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      onOpen();
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
