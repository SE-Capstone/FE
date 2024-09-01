import { Button, Stack } from '@chakra-ui/react';

import { useCreateRoleHook } from '../hooks/mutations';

import { CustomFormProvider, CustomInput, ModalBase } from '@/components/elements';

export interface AddNewRoleWidgetProps {
  children: React.ReactElement;
}

export function AddNewRoleWidget(props: AddNewRoleWidgetProps) {
  const { children } = props;

  const { data, formCreateRole, handleCreateRole, isLoading, reset } = useCreateRoleHook();

  const {
    register,
    control,
    formState: { errors },
  } = formCreateRole;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Thêm mới người dùng"
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-role" w={20} type="submit" isDisabled={isLoading}>
          Save
        </Button>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider id="form-create-role" form={formCreateRole} onSubmit={handleCreateRole}>
        <Stack spacing={5}>
          <CustomInput
            label="Name"
            isRequired
            registration={register('roleName')}
            error={errors.roleName}
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
