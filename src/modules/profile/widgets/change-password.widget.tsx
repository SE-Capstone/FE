import type React from 'react';

import { Button, Heading, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useChangePasswordMutation } from '../apis/change-password.api';
import { changePasswordSchema } from '../validation/change-password.validation';

import type { ChangePasswordFormType } from '../validation/change-password.validation';

import { CustomFormProvider, CustomInput } from '@/components/elements';
import { useFormWithSchema } from '@/libs/hooks';

export const ChangePasswordWidget: React.FC = () => {
  const { t } = useTranslation();
  const form = useFormWithSchema({
    schema: changePasswordSchema(t),
  });

  const { formState, register, reset } = form;
  const { errors, isDirty } = formState;
  const { mutate: changePasswordMutation, isPending: isLoading } = useChangePasswordMutation({
    reset,
  });

  function onSubmit(values: ChangePasswordFormType) {
    if (isLoading) return;

    changePasswordMutation({
      body: values,
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
            {`${t('common.update')} ${t('fields.password').toLowerCase()}`}
          </Heading>
          <Stack spacing={5}>
            <CustomInput
              label={t('fields.currentPassword')}
              type="password"
              registration={register('oldPassword')}
              error={errors?.oldPassword}
            />
            <CustomInput
              label={t('fields.newPassword')}
              type="password"
              isRequired
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
};
