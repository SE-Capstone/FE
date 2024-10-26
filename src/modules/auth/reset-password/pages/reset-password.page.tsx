import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Icon as ChakraIcon, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdOutlineVerifiedUser } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useCheckResetCodeMutation } from '../../apis/check-reset-code';
import { useResetPasswordMutation } from '../../apis/reset-password';
import { resetPasswordSchema } from '../validations/reset-password.validation';

import type { ResetPasswordSchemaType } from '../validations/reset-password.validation';

import { CustomFormProvider, CustomInput, CustomLink } from '@/components/elements';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { LayoutAuth } from '@/modules/auth/layouts';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const formResetPasswordNumber = useFormWithSchema({ schema: resetPasswordSchema(t) });
  const {
    register,
    formState: { errors, isValid },
  } = formResetPasswordNumber;
  const hasCheckedCode = useRef(false);
  const { mutate: resetPasswordMutation, isPending: loadingMutation } = useResetPasswordMutation();
  const { mutate: checkCodeMutation, isPending: loadingCheckCodeMutation } =
    useCheckResetCodeMutation();

  const checkCode = useCallback(async () => {
    if (hasCheckedCode.current) return;
    hasCheckedCode.current = true;

    const code = searchParams.get('code');
    if (code) {
      await checkCodeMutation({ body: { code } });
      setCode(code);
      return;
    }

    navigate(APP_PATHS.login);
  }, [searchParams, navigate, checkCodeMutation]);

  useEffect(() => {
    checkCode();
  }, [checkCode]);

  async function handleSubmitResetPassword(values: ResetPasswordSchemaType) {
    if (!isValid) return;

    try {
      setLoading(true);
      resetPasswordMutation({
        body: {
          code,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      });
    } catch (error) {
      notify({
        type: 'error',
        message: t('messages.resetPasswordFailed'),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutAuth
      title={`${t('common.reset')} - ${t('fields.password')}`}
      Icon={<ChakraIcon as={MdOutlineVerifiedUser} w={8} h={8} />}
    >
      <CustomFormProvider
        form={formResetPasswordNumber}
        isDisabled={loading || loadingMutation || loadingCheckCodeMutation}
        onSubmit={handleSubmitResetPassword}
      >
        <Stack spacing={3}>
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
          <CustomLink style={{ marginLeft: 'auto' }} to={APP_PATHS.login}>
            {t('common.backToLogin')}
          </CustomLink>
          <Button
            type="submit"
            isLoading={loading || loadingMutation}
            isDisabled={loading || loadingMutation}
            w="full"
            variant="solid"
          >
            {t('common.submit')}
          </Button>
        </Stack>
      </CustomFormProvider>
    </LayoutAuth>
  );
}
