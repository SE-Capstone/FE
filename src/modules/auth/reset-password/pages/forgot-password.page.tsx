import React from 'react';

import { Button, Icon as ChakraIcon, HStack, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdLockOpen } from 'react-icons/md';

import { useForgotPasswordMutation } from '../../apis/forgot-password';
import { forgotPasswordSchema } from '../validations';

import type { ForgotPasswordSchemaType } from '../validations';

import { CustomFormProvider, CustomInput, CustomLink } from '@/components/elements';
import { DEFAULT_MESSAGE } from '@/configs';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { LayoutAuth } from '@/modules/auth/layouts';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const formForgotPassword = useFormWithSchema({ schema: forgotPasswordSchema(t) });
  const {
    register,
    formState: { errors, isValid },
    reset,
  } = formForgotPassword;

  const { mutate: forgotPasswordMutation, isPending: loadingMutation } = useForgotPasswordMutation({
    reset,
  });

  async function handleSubmitForgotPassword(values: ForgotPasswordSchemaType) {
    if (!isValid) return;

    try {
      setLoading(true);
      forgotPasswordMutation({ body: { email: values.email } });
    } catch (error) {
      notify({
        type: 'error',
        message: DEFAULT_MESSAGE(t).SOMETHING_WRONG,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutAuth
      title={t('common.forgotPassword')}
      Icon={<ChakraIcon as={MdLockOpen} w={8} h={8} />}
    >
      <CustomFormProvider
        isDisabled={loading || loadingMutation}
        form={formForgotPassword}
        onSubmit={handleSubmitForgotPassword}
      >
        <Stack spacing={3}>
          <CustomInput
            label="Email"
            type="email"
            isRequired
            registration={register('email')}
            error={errors.email}
          />
          <HStack alignItems="center" justifyContent="space-between">
            <CustomLink className="mt-1" style={{ marginLeft: 'auto' }} to={APP_PATHS.login}>
              {t('common.backToLogin')}
            </CustomLink>
          </HStack>
        </Stack>

        <Button
          isLoading={loading}
          isDisabled={loading}
          type="submit"
          w="full"
          variant="solid"
          sx={{ mt: 3, mb: 2 }}
        >
          {t('common.submit')}
        </Button>
      </CustomFormProvider>
    </LayoutAuth>
  );
}
