import { Button, Heading, Stack } from '@chakra-ui/react';

import { useAdminChangePasswordMutation } from '../apis/admin-change-password.api';
import { adminChangePasswordSchema } from '../validations/admin-change-password.validation';

import type { IUser } from '../../list-user/types';
import type { AdminChangePasswordFormType } from '../validations/admin-change-password.validation';

import { CustomFormProvider, CustomInput } from '@/components/elements';
import { useAlertDialogStore } from '@/contexts';
import { useFormWithSchema } from '@/libs/hooks';

export function AdminChangePasswordWidget({ user }: { user?: IUser }) {
  const form = useFormWithSchema({
    schema: adminChangePasswordSchema,
  });

  const { formState, register, reset } = form;
  const { errors, isDirty } = formState;
  const { mutate: changePasswordMutation, isPending: isLoading } = useAdminChangePasswordMutation({
    reset,
  });
  const { openAlert, closeAlert } = useAlertDialogStore(isLoading);

  function onSubmit(values: AdminChangePasswordFormType) {
    if (isLoading) return;

    openAlert({
      title: 'Update',
      description: `Are you sure to update password for user "${user?.fullName}"?`,
      onHandleConfirm() {
        changePasswordMutation({
          body: {
            userId: user?.id || '',
            ...values,
          },
        });

        closeAlert();
      },
    });
  }

  return (
    <CustomFormProvider form={form} onSubmit={onSubmit}>
      <Stack
        direction={{ base: 'column-reverse', xl: 'row' }}
        spacing="24px"
        w={{ base: 'full', xl: '69%' }}
        alignItems="flex-start"
        mt="24px"
      >
        <Stack
          bg="white"
          px={{ base: 4, md: 8 }}
          py="24px"
          rounded="8px"
          w="full"
          direction="column"
          spacing="24px"
        >
          <Heading variant="title" mt="12px">
            Update password
          </Heading>
          <Stack spacing={5}>
            <CustomInput
              label="New password"
              isRequired
              type="password"
              registration={register('newPassword')}
              error={errors?.newPassword}
            />
            <CustomInput
              label="Confirm password"
              isRequired
              type="password"
              registration={register('confirmPassword')}
              error={errors?.confirmPassword}
            />
          </Stack>
          <Stack align="center">
            <Button
              w="150px"
              maxW="100%"
              type="submit"
              isDisabled={isLoading || !isDirty}
              isLoading={isLoading}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </CustomFormProvider>
  );
}
