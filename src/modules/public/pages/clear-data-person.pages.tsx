import { useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Heading,
  Stack,
} from '@chakra-ui/react';

import { clearPersonDataSchema } from '../validations/clear-person-data.validation';

import type { ClearPersonDataFormValues } from '../validations/clear-person-data.validation';

import { CustomFormProvider, CustomInput, CustomPhoneInput } from '@/components/elements';
import { useAlertDialogStore } from '@/contexts';
import { logger } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function ClearDataPersonPage() {
  const [isSent, setIsSent] = useState(false);
  const { openAlert, closeAlert } = useAlertDialogStore();
  const formClearData = useFormWithSchema({
    schema: clearPersonDataSchema,
  });

  const {
    formState: { errors },
    register,
    control,
  } = formClearData;

  function handleSubmit(values: ClearPersonDataFormValues) {
    openAlert({
      title: 'Xác nhận',
      description: 'Bạn có chắc chắn muốn gửi yêu cầu xoá dữ liệu cá nhân?',

      onHandleConfirm() {
        closeAlert();
        logger.debug('data', '', values);
        setIsSent(true);
      },
    });
  }

  return (
    <Center h="h-screen" w="w-screen" overflow="hidden">
      <Box p={4} w="800px">
        {!isSent && (
          <Heading as="h1" size="lg" mb={4}>
            Yêu cầu xoá dữ liệu cá nhân - Bách Gia Phát
          </Heading>
        )}

        <CustomFormProvider form={formClearData} onSubmit={handleSubmit}>
          {!isSent ? (
            <Stack w="full" spacing={4}>
              <CustomInput
                isRequired
                label="Họ"
                name="firstName"
                registration={register('firstName')}
                error={errors.firstName}
              />

              <CustomInput
                isRequired
                label="Tên"
                name="lastName"
                registration={register('lastName')}
                error={errors.lastName}
              />

              <CustomPhoneInput specialLabel="Phone number" control={control} name="phoneNumber" />

              <Button type="submit">Gửi</Button>
            </Stack>
          ) : (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
              rounded={1}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Gửi thành công
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Nhân viên Bách Gia Phát sẽ liên hệ tới Phone number của bạn trong thời gian sớm
                nhất.
              </AlertDescription>
            </Alert>
          )}
        </CustomFormProvider>
      </Box>
    </Center>
  );
}
