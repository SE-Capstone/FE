import { Stack } from '@chakra-ui/react';

import { useGetGroupPermissions } from '../../detail-role/apis/get-permissions.api';
import { ListPermissionWidget } from '../../detail-role/widgets/list-permission.widget';
import { useCreateRoleHook } from '../hooks/mutations';

import { CustomFormProvider, CustomInput, CustomTextArea } from '@/components/elements';
import { EditRow } from '@/components/widgets';

export function CreateRolePage() {
  const { groupPermissions, isError, isLoading } = useGetGroupPermissions();
  const { form, handleCreateRole, isLoading: isCreating } = useCreateRoleHook();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
      <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={handleCreateRole}>
        <EditRow
          title="Role name"
          stackProps={{
            maxW: 25,
            justifyContent: 'end',
            alignSelf: 'start',
          }}
        >
          <CustomInput
            maxW={{
              base: '100%',
              md: '100%',
              lg: '60%',
            }}
            isRequired
            placeholder="Enter role name"
            registration={register('name')}
            error={errors.name}
          />
        </EditRow>
        <EditRow
          title="Description"
          stackProps={{
            maxW: 25,
            justifyContent: 'end',
            alignSelf: 'start',
          }}
        >
          <CustomTextArea
            mt={2}
            maxW={{
              base: '100%',
              md: '100%',
              lg: '60%',
            }}
            isRequired
            placeholder="Enter description"
            registration={register('description')}
            error={errors.description}
          />
        </EditRow>
        <EditRow
          title="Permissions"
          stackProps={{
            maxW: 25,
            justifyContent: 'end',
            alignSelf: 'start',
          }}
        >
          <ListPermissionWidget
            groupPermissions={groupPermissions}
            isLoading={isLoading}
            isError={!!isError}
            isDisabled={isCreating}
            form={form}
            isCreate
          />
        </EditRow>
      </CustomFormProvider>
    </Stack>
  );
}
