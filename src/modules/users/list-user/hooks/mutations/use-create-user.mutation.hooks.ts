import { useCallback } from 'react';

import { useCreateUserMutation } from '../../apis/create-user.api';
import { userFormSchema } from '../../validations/users.validations';

import type { UserFormValues } from '../../validations/users.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useCreateUserHook() {
  const formCreateUser = useFormWithSchema({
    schema: userFormSchema,
  });

  const { reset } = formCreateUser;

  const {
    mutate: loginMutation,
    isPending: isLoading,
    ...restData
  } = useCreateUserMutation({ reset });

  const handleCreateUser = useCallback(
    async (values: UserFormValues) => {
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
    formCreateUser,
    handleCreateUser,
    isLoading,
    ...restData,
  };
}
