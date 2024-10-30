import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { IResponseApi } from '@/configs/axios';
import type { MutationConfig } from '@/libs/react-query';

import { DEFAULT_MESSAGE } from '@/configs';
import { getErrorMessage, notify } from '@/libs/helpers';
import { makeRequest } from '@/libs/react-query';
import { ALL_ENDPOINT_URL_STORE } from '@/services/endpoint-url-store';
import { allQueryKeysStore } from '@/services/query-keys-store';

interface IUpsertUserSkillsRequest {
  body: {
    userId: string;
    skillIds: string[];
    isDelete?: boolean;
  };
}

function mutation(req: IUpsertUserSkillsRequest) {
  const { body } = req;
  return makeRequest<typeof body, IResponseApi<never>>({
    method: body.isDelete ? 'DELETE' : 'POST',
    url: body.isDelete
      ? ALL_ENDPOINT_URL_STORE.skills.deleteSkills
      : ALL_ENDPOINT_URL_STORE.skills.addSkills,
    data: body,
  });
}

interface Props {
  configs?: MutationConfig<typeof mutation>;
  isDelete?: boolean;
  userId: string;
}

export function useUpsertUserSkillsMutation({ configs, userId }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.skill.skills.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: allQueryKeysStore.skill.listUserSkill(userId).queryKey,
      });
      notify({
        type: 'success',
        message: DEFAULT_MESSAGE(t).UPDATE_SUCCESS,
      });
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
