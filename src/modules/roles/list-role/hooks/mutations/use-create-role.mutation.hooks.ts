import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useCreateRoleMutation } from '../../apis/create-role.api';
import { createRoleFormSchema } from '../../validations/create-role.validation';

import type { CreateRoleFormType } from '../../validations/create-role.validation';

import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useCreateRoleHook() {
  const { t } = useTranslation();
  const form = useFormWithSchema({
    schema: createRoleFormSchema(t),
  });

  const { reset } = form;

  const { mutate, isPending: isLoading, ...restData } = useCreateRoleMutation({ reset });

  const handleCreateRole = useCallback(
    async (values: CreateRoleFormType) => {
      if (isLoading) return;

      if (!values.permissionsId) {
        notify({ type: 'error', message: 'At least one permission must be selected' });
        return;
      }

      try {
        await mutate({
          body: values,
        });
      } catch (error) {}
    },
    [mutate, isLoading]
  );

  return {
    form,
    handleCreateRole,
    isLoading,
    ...restData,
  };
}
