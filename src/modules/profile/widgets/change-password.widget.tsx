import type React from 'react';

import { Button, Heading, Stack } from '@chakra-ui/react';

import { useChangePasswordMutation } from '../apis/change-password.api';
import { changePasswordSchema } from '../validation/change-password.validation';

import type { ChangePasswordFormType } from '../validation/change-password.validation';

import { CustomFormProvider, CustomInput } from '@/components/elements';
import { useFormWithSchema } from '@/libs/hooks';

export const ChangePasswordWidget: React.FC = () => {
  const form = useFormWithSchema({
    schema: changePasswordSchema,
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
            Update password
          </Heading>
          <Stack spacing={5}>
            <CustomInput
              label="Mật khẩu hiện tại"
              type="password"
              registration={register('oldPassword')}
              error={errors?.oldPassword}
            />
            <CustomInput
              label="New password"
              type="password"
              isRequired
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
};
