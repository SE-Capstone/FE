import { Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGetGroupPermissions } from '../apis/get-permissions.api';
import { useGetRole } from '../apis/get-role-detail.api';
import { ListPermissionWidget } from '../widgets/list-permission.widget';

import { CustomInput } from '@/components/elements';
import { CustomEditableInput } from '@/components/elements/form/custom-editable-input';

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
        isLoading={false}
        initialValue="Initial Value"
        inputChildren={<CustomInput isRequired placeholder="Enter full name" />}
      />
      <ListPermissionWidget
        role={role}
        groupPermissions={groupPermissions}
        isLoading={isLoading || isRoleDetailLoading}
        isError={!!isError || !!isRoleDetailError}
      />
    </Stack>
  );
}
