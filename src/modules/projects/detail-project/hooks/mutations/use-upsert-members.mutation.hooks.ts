import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useUpsertMembersMutation } from '../../apis/upsert-members.api';
import { upsertMembersFormSchema } from '../../validations/upsert-members.validation';

import type { UpsertMembersFormType } from '../../validations/upsert-members.validation';

import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertMembersHook() {
  const { t } = useTranslation();
  const formUpsertMembers = useFormWithSchema({
    schema: upsertMembersFormSchema(t),
  });

  const { reset } = formUpsertMembers;

  const { mutate, isPending: isLoading, ...restData } = useUpsertMembersMutation({ reset });

  const handleUpsertMembers = useCallback(
    async (values: UpsertMembersFormType) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            projectId: values.projectId || '',
            memberIds: Array.from(values.memberIds),
          },
        });
      } catch (error) {}
    },
    [mutate, isLoading]
  );

  return {
    formUpsertMembers,
    handleUpsertMembers,
    isLoading,
    ...restData,
  };
}
