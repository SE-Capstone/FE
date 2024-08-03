import { useMutation } from '@tanstack/react-query';

import type { ISupport } from '../models';
import type { SupportPayload } from '../validations/support.validation';
import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { notify, showErrorFromApi } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';

function mutate(data: SupportPayload) {
  return makeRequest<typeof data, IResponseApi<ISupport>>({
    method: 'POST',
    url: 'support/create',
    data,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationCreateSupport({ configs }: IProps = {}) {
  return useMutation({
    mutationFn: mutate,
    onError: (error) => {
      showErrorFromApi(error);
    },
    onSuccess: async () => {
      notify({ type: 'success', message: 'Thành công!' });
      window.location.reload();
    },
    ...configs,
  });
}
