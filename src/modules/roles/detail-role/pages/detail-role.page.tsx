import { Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGetGroupPermissions } from '../apis/get-permissions.api';
import { useGetRole } from '../apis/get-role-detail.api';
import { ListPermissionWidget } from '../widgets/list-permission.widget';

import { CustomInput, CustomTextArea } from '@/components/elements';
import { CustomEditableInput } from '@/components/elements/form/custom-editable-input';
import { EditRow } from '@/components/widgets';

export function DetailRolePage() {
  const { roleId } = useParams();
  const {
    role,
    isError: isRoleDetailError,
    isLoading: isRoleDetailLoading,
  } = useGetRole({ roleId: roleId || '' });
  const { groupPermissions, isError, isLoading } = useGetGroupPermissions();

  return (
    <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
      <CustomEditableInput
        title="Role name"
        isLoading={isRoleDetailLoading}
        initialValue={role?.name || ''}
        inputChildren={<CustomInput isRequired placeholder="Enter role name" />}
      />
      <CustomEditableInput
        title="Description"
        isLoading={isRoleDetailLoading}
        initialValue={role?.description || ''}
        inputChildren={
          <CustomTextArea
            isRequired
            placeholder="Enter description"
            // registration={register('message')}
            // error={errors.message}
          />
        }
      />
      <EditRow
        title="Permissions"
        stackProps={{
          maxW: 25,
          justifyContent: 'end',
          alignSelf: 'start',
        }}
      >
        <ListPermissionWidget
          role={role}
          groupPermissions={groupPermissions}
          isLoading={isLoading || isRoleDetailLoading}
          isError={!!isError || !!isRoleDetailError}
        />
      </EditRow>
    </Stack>
  );
}
