import { Button, Icon, Stack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { MdOutlineFileUpload } from 'react-icons/md';

import { useCreateApplicantHook } from '../hooks/mutations';

import { CustomFormProvider, CustomInput, FileUpload, ModalBase } from '@/components/elements';
import { phoneNumberAutoFormat } from '@/libs/helpers';

export interface AddNewApplicantWidgetProps {
  children: React.ReactElement;
}

export function AddNewApplicantWidget(props: AddNewApplicantWidgetProps) {
  const { children } = props;

  const { data, formCreateApplicant, handleCreateApplicant, isLoading, reset } =
    useCreateApplicantHook();

  const {
    register,
    control,
    formState: { errors },
  } = formCreateApplicant;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Create applicant"
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-applicant" w={20} type="submit" isDisabled={isLoading}>
          Save
        </Button>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-create-applicant"
        form={formCreateApplicant}
        onSubmit={handleCreateApplicant}
      >
        <Stack spacing={5}>
          <CustomInput
            label="Name"
            isRequired
            registration={register('name')}
            error={errors.name}
          />
          <CustomInput
            label="Email"
            type="email"
            isRequired
            registration={register('email')}
            error={errors.email}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <CustomInput
                label="Phone number"
                placeholder="012-345-6789"
                isRequired
                error={errors?.phoneNumber}
                value={value ?? ''}
                maxLength={12}
                onChange={(e) => {
                  onChange(phoneNumberAutoFormat(e.target.value));
                }}
                {...field}
              />
            )}
          />
          <CustomInput
            label="Start date"
            type="date"
            registration={register('startDate')}
            error={errors.startDate}
          />
          <FileUpload
            label="CV file"
            control={control}
            name="cvFile"
            error={errors?.cvFile}
            types={['pdf', 'word']}
            displayFileName
            acceptedFileTypes="application/pdf,application/msword"
            trigger={() => (
              <Button
                color="secondary"
                fontWeight={500}
                size="lg"
                variant="ghost"
                leftIcon={<Icon as={MdOutlineFileUpload} boxSize={5} />}
                isDisabled={isLoading}
              >
                Upload
              </Button>
            )}
            stackProps={{ direction: 'column', align: 'flex-start', spacing: 4 }}
            controlProps={{
              bg: 'white',
              rounded: '8px',
              w: { base: 'full' },
            }}
            labelProps={{
              w: 'full',
            }}
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
