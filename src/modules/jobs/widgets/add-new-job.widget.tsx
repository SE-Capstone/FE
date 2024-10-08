import { Button, Stack } from '@chakra-ui/react';

import { useCreateJobHook } from '../hooks/mutations';

import { CustomFormProvider, CustomInput, CustomTextArea, ModalBase } from '@/components/elements';

export interface AddNewJobWidgetProps {
  children: React.ReactElement;
}

export function AddNewJobWidget(props: AddNewJobWidgetProps) {
  const { children } = props;

  const { data, formCreateJob, handleCreateJob, isLoading, reset } = useCreateJobHook();

  const {
    register,
    formState: { errors },
  } = formCreateJob;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Create job"
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-job" w={20} type="submit" isDisabled={isLoading}>
          Save
        </Button>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider id="form-create-job" form={formCreateJob} onSubmit={handleCreateJob}>
        <Stack spacing={5}>
          <CustomInput
            label="Subject"
            isRequired
            registration={register('title')}
            error={errors.title}
          />
          <CustomTextArea
            label="Description"
            isRequired
            registration={register('description')}
            error={errors.description}
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
