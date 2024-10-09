import { Button, Stack } from '@chakra-ui/react';

import { useCreatePositionHook } from '../hooks/mutations';

import { CustomFormProvider, CustomInput, CustomTextArea, ModalBase } from '@/components/elements';

export interface AddNewPositionWidgetProps {
  children: React.ReactElement;
}

export function AddNewPositionWidget(props: AddNewPositionWidgetProps) {
  const { children } = props;

  const { data, formCreatePosition, handleCreatePosition, isLoading, reset } =
    useCreatePositionHook();

  const {
    register,
    formState: { errors },
  } = formCreatePosition;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Create position"
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-position" w={20} type="submit" isDisabled={isLoading}>
          Save
        </Button>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-create-position"
        form={formCreatePosition}
        onSubmit={handleCreatePosition}
      >
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
