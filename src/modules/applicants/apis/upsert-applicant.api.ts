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

interface IUpsertApplicantRequest {
  body: {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    startDate?: string;
    cvFile?: File | string;
  };
}

function mutation(req: IUpsertApplicantRequest, isUpdate = false) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IApplicant>>({
    method: isUpdate ? 'PUT' : 'POST',
    url: isUpdate
      ? ALL_ENDPOINT_URL_STORE.applicants.update
      : ALL_ENDPOINT_URL_STORE.applicants.create,
    data: body,
    isFormData: true,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  reset?: () => void;
  onClose?: () => void;
  isUpdate?: boolean;
}

export function useUpsertApplicantMutation({ configs, reset, onClose, isUpdate }: Props = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req) => mutation(req, isUpdate),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.applicant.applicants.queryKey,
      });
      notify({
        type: 'success',
        message: isUpdate ? DEFAULT_MESSAGE(t).UPDATE_SUCCESS : DEFAULT_MESSAGE(t).CREATE_SUCCESS,
      });
      reset && reset();
      onClose && onClose();
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
