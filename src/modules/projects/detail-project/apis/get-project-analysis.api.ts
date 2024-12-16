import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IResponseApi } from '@/configs/axios';

import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest, type MutationConfig } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';

interface IProjectAnalysisRequest {
  body: {
    searchTerm: string;
  };
}

export interface ProjectAnalysisResponse {
  description: string;
}

export function mutation(req: IProjectAnalysisRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<ProjectAnalysisResponse>>({
    method: 'POST',
    url: ALL_ENDPOINT_URL_STORE.projects.projectAnalysis,
    data: body,
    isFormData: true,
  });
}

interface UseProjectAnalysisQueryProps {
  configs?: MutationConfig<typeof mutation>;
  onOpen: () => void;
}

export function useProjectAnalysisMutation(props: UseProjectAnalysisQueryProps) {
  const { t } = useTranslation();
  const { configs, onOpen } = props;

  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      onOpen();
    },

    throwOnError: false,
    onError(error) {
      notify({
        type: 'error',
        message: getErrorMessage(t, error),
      });
    },

    ...configs,
  });
}
