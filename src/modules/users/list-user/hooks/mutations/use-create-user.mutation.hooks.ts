import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useCreateUserMutation } from '../../apis/create-user.api';
import { userFormSchema } from '../../validations/users.validations';

import type { UserFormValues } from '../../validations/users.validations';

import { cleanPhoneNumber, formatDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function useCreateUserHook() {
  const { t } = useTranslation();
  const formCreateUser = useFormWithSchema({
    schema: userFormSchema(t),
  });

  const { reset } = formCreateUser;

  const { mutate, isPending: isLoading, ...restData } = useCreateUserMutation({ reset });

  const handleCreateUser = useCallback(
    async (values: UserFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            ...values,
            phone: cleanPhoneNumber(values.phone),
            dob: formatDate({
              date: values.dob,
              format: 'YYYY-MM-DD',
            }),
          },
        });
      } catch (error) {}
    },
    [mutate, isLoading]
  );

  return {
    formCreateUser,
    handleCreateUser,
    isLoading,
    ...restData,
  };
}
