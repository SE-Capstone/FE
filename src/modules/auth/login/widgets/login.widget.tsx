import React from 'react';

import { Button, Icon as ChakraIcon, Stack } from '@chakra-ui/react';
import { MdLockOpen } from 'react-icons/md';

import { useLoginMutation } from '../../apis/login.api';
import { loginValidationSchema } from '../validations';

import type { LoginValidationSchemaType } from '../validations';

import { CustomFormProvider, CustomInput } from '@/components/elements';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { LayoutAuth } from '@/modules/auth/layouts';

export function LoginWidget() {
  const [loading, setLoading] = React.useState(false);
  const formLogin = useFormWithSchema({ schema: loginValidationSchema });
  const {
    register,
    formState: { errors, isValid },
  } = formLogin;

  const { mutate: loginMutation, isPending: loadingMutation } = useLoginMutation();

  async function handleSubmitLogin(values: LoginValidationSchemaType) {
    if (!isValid) return;

    try {
      setLoading(true);
      loginMutation({ body: { email: values.email, password: values.password } });
    } catch (error) {
      notify({
        type: 'error',
        message: 'Đăng nhập thất bại, vui lòng thử lại',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LayoutAuth title="Đăng nhập" Icon={<ChakraIcon as={MdLockOpen} w={8} h={8} />}>
      <CustomFormProvider
        isDisabled={loading || loadingMutation}
        form={formLogin}
        onSubmit={handleSubmitLogin}
      >
        <Stack spacing={5}>
          <CustomInput
            label="Email"
            isRequired
            placeholder="Nhập email"
            registration={register('email')}
            className="mb-2"
            error={errors.email}
          />
          <CustomInput
            label="Mật khẩu"
            isRequired
            type="password"
            placeholder="Nhập mật khẩu"
            registration={register('password')}
            error={errors.password}
          />
          {/* <HStack alignItems="center" justifyContent="space-between">
            <Checkbox size="lg" value="remember">
              Remember me
            </Checkbox>
            <CustomLink to="/forgot-password">Forgot password?</CustomLink>
          </HStack> */}
        </Stack>

        <Button
          isLoading={loading || loadingMutation}
          isDisabled={loading || loadingMutation}
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
