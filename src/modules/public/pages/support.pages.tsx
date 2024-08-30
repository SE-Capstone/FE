import { Button, Center, Container, Heading, Stack, Text } from '@chakra-ui/react';

import { useMutationCreateSupport } from '../apis';
import { SupportSchemaValidator } from '../validations/support.validation';

import type { SupportPayload } from '../validations/support.validation';

import {
  CustomFormProvider,
  CustomInput,
  CustomPhoneInput,
  CustomTextArea,
  Head,
} from '@/components/elements';
import { useFormWithSchema } from '@/libs/hooks';

export function SupportPage() {
  const formSupport = useFormWithSchema({
    schema: SupportSchemaValidator,
  });

  const {
    control,
    register,
    formState: { errors },
  } = formSupport;

  const createMutation = useMutationCreateSupport();

  function handleSubmit(values: SupportPayload) {
    createMutation.mutate(values);
  }

  return (
    <Container maxW="container.2xl" centerContent h="h-screen" overflowY="auto">
      <Head title="Hỗ trợ và giúp đỡ" />
      <Center p={6} w="full" h="full">
        <Stack spacing={8} w="600px">
          <Heading textAlign="center">Hỗ trợ và giúp đỡ</Heading>
          <Text>Hãy liên lạc và cho chúng tôi biết làm thế nào chúng ta có thể giúp đỡ</Text>

          <CustomFormProvider form={formSupport} onSubmit={handleSubmit}>
            <Stack spacing={5}>
              <CustomPhoneInput
                placeholder="Phone number"
                specialLabel="Phone number (*)"
                control={control}
                name="phoneNumber"
              />
              <CustomInput
                label="Chủ đề"
                isRequired
                placeholder="Nhập chủ đề"
                registration={register('subject')}
                error={errors.subject}
              />

              <CustomTextArea
                label="Nội dung"
                isRequired
                placeholder="Nhập nội dung"
                registration={register('message')}
                error={errors.message}
              />
              <Button
                aria-label="send support"
                type="submit"
                isLoading={createMutation.isPending}
                isDisabled={createMutation.isPending}
              >
                Gửi
              </Button>
            </Stack>
          </CustomFormProvider>
        </Stack>
      </Center>
    </Container>
  );
}
