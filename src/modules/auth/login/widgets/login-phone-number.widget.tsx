import React, { useCallback } from 'react';

import { Button, Icon as ChakraIcon } from '@chakra-ui/react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { MdLockOpen } from 'react-icons/md';

import { loginPhoneNumberValidationSchema } from '../validations';

import type { LoginPhoneNumberValidationSchemaType } from '../validations';
import type { AuthError } from 'firebase/auth';

import { CustomFormProvider, CustomPhoneInput } from '@/components/elements';
import { auth } from '@/firebase/firebase.config';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { LayoutAuth } from '@/modules/auth/layouts';

interface LoginPhoneNumberWidgetProps {
  onShowOTP: () => void;
}

export function LoginPhoneNumberWidget({ onShowOTP }: LoginPhoneNumberWidgetProps) {
  const [loading, setLoading] = React.useState(false);
  const formLoginPhoneNumber = useFormWithSchema({ schema: loginPhoneNumberValidationSchema });
  const {
    control,
    formState: { isValid },
  } = formLoginPhoneNumber;

  const onCaptchaVerify = useCallback(async (phoneNumber: string) => {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  }, []);

  async function handleSubmitLoginPhoneNumber(values: LoginPhoneNumberValidationSchemaType) {
    if (!isValid) return;

    const formatPhone = values.phoneNumber;

    try {
      setLoading(true);
      const confirmationResult = await onCaptchaVerify(formatPhone);
      (window as any).confirmationResult = confirmationResult;
      notify({
        type: 'success',
        message: `Mã OTP đã được gửi đến số điện thoại của bạn`,
      });
      onShowOTP();
    } catch (error) {
      const errorFirebase = { ...(error as AuthError) };
      if (errorFirebase.code === 'auth/too-many-requests') {
        notify({
          type: 'error',
          message: 'Vui lòng thử lại sau một lúc',
        });

        return;
      }

      notify({
        type: 'error',
        message: 'Gửi mã OTP thất bại, vui lòng thử lại',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutAuth title="Đăng nhập" Icon={<ChakraIcon as={MdLockOpen} w={8} h={8} />}>
      <CustomFormProvider
        isDisabled={loading}
        form={formLoginPhoneNumber}
        onSubmit={handleSubmitLoginPhoneNumber}
      >
        <CustomPhoneInput
          placeholder="Số điện thoại"
          specialLabel="Số điện thoại"
          control={control}
          name="phoneNumber"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmitLoginPhoneNumber(formLoginPhoneNumber.getValues());
            }
          }}
        />

        {/* <HStack alignItems="center" justifyContent="space-between">
          <Checkbox size="lg" value="remember">
            Remember me
          </Checkbox>
          <CustomLink to="/forgot-password">Forgot password?</CustomLink>
        </HStack> */}

        {/* recaptcha google */}
        <div id="recaptcha-container" />
        {/* end  recaptcha google */}

        <Button
          isLoading={loading}
          isDisabled={loading}
          type="submit"
          w="full"
          variant="solid"
          sx={{ mt: 3, mb: 2 }}
        >
          Gửi
        </Button>
      </CustomFormProvider>
    </LayoutAuth>
  );
}
