import { useCallback } from 'react';

import { useCreateRoleMutation } from '../../apis/create-role.api';
import { roleFormSchema } from '../../validations/roles.validations';

import type { RoleFormValues } from '../../validations/roles.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useCreateRoleHook() {
  const formCreateRole = useFormWithSchema({
    schema: roleFormSchema,
  });

  const { reset } = formCreateRole;

  const {
    mutate: loginMutation,
    isPending: isLoading,
    ...restData
  } = useCreateRoleMutation({ reset });

  const handleCreateRole = useCallback(
    async (values: RoleFormValues) => {
      if (isLoading) return;

      try {
        await loginMutation({
          body: values,
        });
      } catch (error) {}
    },
    [loginMutation, isLoading]
  );

  return {
    formCreateRole,
    handleCreateRole,
    isLoading,
    ...restData,
  };
}
