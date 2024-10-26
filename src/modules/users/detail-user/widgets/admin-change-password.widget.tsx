import { Button, Heading, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useAdminChangePasswordMutation } from '../apis/admin-change-password.api';
import { adminChangePasswordSchema } from '../validations/admin-change-password.validation';

import type { IUser } from '../../list-user/types';
import type { AdminChangePasswordFormType } from '../validations/admin-change-password.validation';

import { CustomFormProvider, CustomInput } from '@/components/elements';
import { useAlertDialogStore } from '@/contexts';
import { useFormWithSchema } from '@/libs/hooks';

export function AdminChangePasswordWidget({ user }: { user?: IUser }) {
  const { t } = useTranslation();
  const form = useFormWithSchema({
    schema: adminChangePasswordSchema(t),
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
      title: t('common.edit'),
      description: `${t('actions.updatePassword')} ${user?.fullName}`,
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
        w={{ base: 'full' }}
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
            {`${t('common.update')} ${t('fields.password').toLowerCase()}`}
          </Heading>
          <Stack spacing={5}>
            <CustomInput
              label={t('fields.newPassword')}
              isRequired
              type="password"
              registration={register('newPassword')}
              error={errors?.newPassword}
            />
            <CustomInput
              label={t('fields.confirmPassword')}
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
              {t('common.save')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </CustomFormProvider>
  );
}
