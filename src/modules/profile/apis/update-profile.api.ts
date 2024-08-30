import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { IUpdateUserResponse } from '../types';
import type { GenderEnum } from '@/configs';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

export interface IUpdateProfileRequest {
  body: {
    address: string;
    avatar?: File | string;
    fullName: string;
    gender: GenderEnum;
    dob: Date | string;
    phone: string;
    bankAccount: string;
    bankAccountName: string;
  };
}

function mutation(req: IUpdateProfileRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<IUpdateUserResponse>>({
    method: 'PUT',
    url: ALL_ENDPOINT_URL_STORE.user.updateProfile,
    data: body,
    isFormData: true,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutation>;
}

export function useUpdateProfileMutation({ configs }: IProps = {}) {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutation,

    onSuccess: (data) => {
      if (data.statusCode !== 200) {
        notify({ type: 'error', message: DEFAULT_MESSAGE.SOMETHING_WRONG });
        return;
      }

      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.user['user/profile'].queryKey,
      });

      notify({
        type: 'success',
        message: DEFAULT_MESSAGE.UPDATE_SUCCESS,
      });

      navigate(APP_PATHS.profile);
    },

    onError(error) {
      notify({ type: 'error', message: getErrorMessage(error) });
    },

    ...configs,
  });
}
