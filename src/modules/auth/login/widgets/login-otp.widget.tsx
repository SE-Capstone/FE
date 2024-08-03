import { useState } from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Icon as ChakraIcon,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { MdOutlineVerifiedUser } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { AlertUnauthorizedWidget } from './alert-unauthorized.widget';
import { useLoginMutation } from '../../apis/login.api';
import { loginOtpValidationSchema } from '../validations';

import type { LoginOtpValidationSchemaType } from '../validations';
import type { AuthError } from 'firebase/auth';

import { CustomFormProvider, CustomPinInput } from '@/components/elements';
import { logger, notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { LayoutAuth } from '@/modules/auth/layouts';

interface LoginOtpWidgetProps {
  onShowPhone: () => void;
}

export function LoginOtpWidget(props: LoginOtpWidgetProps) {
  const { onShowPhone } = props;
  const [loading, setLoading] = useState(false);
  const disclosureShowUnauthorized = useDisclosure();

  const formLoginOtp = useFormWithSchema({ schema: loginOtpValidationSchema });

  const { control } = formLoginOtp;

  const { mutate: loginMutation, isPending: loadingMutation } = useLoginMutation();

  function onOTPVerify(values: LoginOtpValidationSchemaType) {
    setLoading(true);
    (window as any).confirmationResult
      .confirm(values.otpCode)
      .then((data) => {
        const idToken = data?._tokenResponse?.idToken;
        logger.info('idToken: ', idToken);
        // TODO: change to check email otp
        loginMutation({ body: { phone: values.otpCode } });

        setLoading(false);
      })
      .catch((error) => {
        const errorFirebase = error as AuthError;
        logger.info(' error firebase', JSON.stringify({ ...errorFirebase }));

        if (errorFirebase.code === 'auth/code-expired') {
          notify({
            type: 'error',
            message: 'Phiên làm việc hết hạn',
          });

          setTimeout(onShowPhone, 2000);
        }
        if (errorFirebase.code === 'auth/invalid-verification-code') {
          notify({
            type: 'error',
            message: 'Otp không hợp lệ. Vui lòng nhập lại',
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function render() {
    if (disclosureShowUnauthorized.isOpen) {
      return (
        <Center h="h-screen">
          <Box w="600px">
            <AlertUnauthorizedWidget
              onCancel={() => {
                window.location.href = '/auth/login';
              }}
            />
          </Box>
        </Center>
      );
    }

    return (
      <LayoutAuth title="Xác thực" Icon={<ChakraIcon as={MdOutlineVerifiedUser} w={8} h={8} />}>
        <CustomFormProvider
          form={formLoginOtp}
          isDisabled={loading || loadingMutation}
          onSubmit={onOTPVerify}
        >
          <Stack spacing={6}>
            <CustomPinInput control={control} name="otpCode" />
            <ButtonGroup>
              <Button
                as={Link}
                to=".."
                isDisabled={loading || loadingMutation}
                w="full"
                variant="ghost"
              >
                Quay lại
              </Button>
              <Button
                type="submit"
                isLoading={loading || loadingMutation}
                isDisabled={loading || loadingMutation}
                w="full"
                variant="solid"
              >
                Xác nhận
              </Button>
            </ButtonGroup>
          </Stack>
        </CustomFormProvider>
      </LayoutAuth>
    );
  }

  return <>{render()}</>;
}
