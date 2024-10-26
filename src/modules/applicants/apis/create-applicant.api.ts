import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IApplicant } from '../types';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface ICreateApplicantRequest {
  body: {
    name: string;
    email: string;
    phoneNumber: string;
    startDate?: string;
    cvFile?: File | string;
  };
}

function mutation(req: ICreateApplicantRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IApplicant>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.applicants.create,
    data: body,
    isFormData: true,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
}

export function useCreateApplicantMutation({ configs, reset }: Props = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: (data) => {
      if (data.statusCode !== 201) {
        notify({ type: 'error', message: DEFAULT_MESSAGE(t).SOMETHING_WRONG });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.applicant.applicants.queryKey,
      });
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).CREATE_SUCCESS,
      });
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
