import React from 'react';

import { Button, Center, Icon as ChakraIcon, HStack, Stack } from '@chakra-ui/react';
import { GoogleLogin } from '@react-oauth/google';
import { MdLockOpen } from 'react-icons/md';

import { useGoogleLoginMutation } from '../../apis/google-login.api';
import { useLoginMutation } from '../../apis/login.api';
import { loginValidationSchema } from '../validations';

import type { LoginValidationSchemaType } from '../validations';

import { CustomFormProvider, CustomInput, CustomLink } from '@/components/elements';
import { DEFAULT_MESSAGE } from '@/configs';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { LayoutAuth } from '@/modules/auth/layouts';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function LoginWidget() {
  const [loading, setLoading] = React.useState(false);
  const formLogin = useFormWithSchema({ schema: loginValidationSchema });
  const {
    register,
    formState: { errors, isValid },
  } = formLogin;

  const { mutate: loginMutation, isPending: loadingMutation } = useLoginMutation();
  const { mutate: googleLoginMutation, isPending: loadingGgLoginMutation } =
    useGoogleLoginMutation();

  async function handleSubmitLogin(values: LoginValidationSchemaType) {
    if (!isValid) return;

    try {
      setLoading(true);
      loginMutation({ body: { email: values.email, password: values.password } });
    } catch (error) {
      notify({
        type: 'error',
        message: 'Login failed, Please try again!',
      });
    } finally {
      setLoading(false);
    }
  }
  async function handleSubmitGoogleLogin(idToken?: string) {
    if (!isValid) return;

    if (!idToken) {
      notify({
        type: 'error',
        message: DEFAULT_MESSAGE.SOMETHING_WRONG,
      });
      return;
    }

    try {
      setLoading(true);
      googleLoginMutation({ body: { idToken } });
    } catch (error) {
      notify({
        type: 'error',
        message: 'Login failed, Please try again!',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutAuth title="Login" Icon={<ChakraIcon as={MdLockOpen} w={8} h={8} />}>
      <CustomFormProvider
        isDisabled={loading || loadingMutation || loadingGgLoginMutation}
        form={formLogin}
        onSubmit={handleSubmitLogin}
      >
        <Stack spacing={3}>
          <CustomInput
            label="Email"
            isRequired
            placeholder="Nhập email"
            registration={register('email')}
            error={errors.email}
          />
          <CustomInput
            label="Password"
            isRequired
            type="password"
            placeholder="Enter password"
            registration={register('password')}
            error={errors.password}
          />
          <HStack alignItems="center" justifyContent="space-between">
            {/* <Checkbox size="lg" value="remember">
              Remember me
            </Checkbox> */}
            <CustomLink style={{ marginLeft: 'auto' }} to={APP_PATHS.forgotPassword}>
              Forgot password?
            </CustomLink>
          </HStack>
          <Center>
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleSubmitGoogleLogin(credentialResponse.credential)
              }
              onError={() => {
                notify({
                  type: 'error',
                  message: DEFAULT_MESSAGE.SOMETHING_WRONG,
                });
              }}
            />
          </Center>
        </Stack>
        <Button
          isLoading={loading || loadingMutation}
          isDisabled={loading || loadingMutation}
          type="submit"
          w="full"
          variant="solid"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
      </CustomFormProvider>
    </LayoutAuth>
  );
}
