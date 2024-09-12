import { useEffect } from 'react';

import { Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useUpdateRoleMutation } from './update-role.api';
import { useGetGroupPermissions } from '../apis/get-permissions.api';
import { useGetRole } from '../apis/get-role-detail.api';
import { updateRoleFormSchema } from '../validations/update-role.validation';
import { ListPermissionWidget } from '../widgets/list-permission.widget';

import type { UpdateRoleFormType } from '../validations/update-role.validation';

import { CustomFormProvider, CustomInput, CustomTextArea } from '@/components/elements';
import { CustomEditableInput } from '@/components/elements/form/custom-editable-input';
import { EditRow } from '@/components/widgets';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function DetailRolePage() {
  const { roleId } = useParams();

  const {
    role,
    isError: isRoleDetailError,
    isLoading: isRoleDetailLoading,
  } = useGetRole({ roleId: roleId || '' });
  const { groupPermissions, isError, isLoading } = useGetGroupPermissions();

  const { mutate: updateRoleMutation, isPending: isUpdating } = useUpdateRoleMutation();

  const form = useFormWithSchema({
    schema: updateRoleFormSchema,
  });

  const { formState, register, reset } = form;
  const { errors, dirtyFields } = formState;

  useEffect(() => {
    reset(role, {
      keepDirty: false,
    });
  }, [reset, role]);

  async function onSubmit(values: UpdateRoleFormType) {
    if (isLoading || !role?.permissions) return;

    await updateRoleMutation({
      body: {
        ...values,
        id: roleId || '',
        permissionsId: role.permissions.map((permission) => permission.id),
      },
    });
  }

  function updatePermissions(permissions: Set<string>) {
    if (isLoading || !role) return;

    if (permissions.size === 0) {
      notify({ type: 'error', message: 'Permissions can not set to empty' });
      return;
    }

    updateRoleMutation({
      body: {
        id: roleId || '',
        name: role.name,
        description: role.description,
        permissionsId: Array.from(permissions),
      },
    });
  }

  return (
    <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
      <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={onSubmit}>
        <CustomEditableInput
          title="Role name"
          isLoading={isRoleDetailLoading}
          isDisabled={isUpdating || !dirtyFields.name}
          initialValue={role?.name || ''}
          inputChildren={
            <CustomInput
              isRequired
              placeholder="Enter role name"
              registration={register('name')}
              error={errors.name}
            />
          }
          onSubmit={() => form.handleSubmit(onSubmit)()}
        />
        <CustomEditableInput
          title="Description"
          isLoading={isRoleDetailLoading}
          isDisabled={isUpdating || !dirtyFields.description}
          initialValue={role?.description || ''}
          inputChildren={
            <CustomTextArea
              isRequired
              placeholder="Enter description"
              registration={register('description')}
              error={errors.description}
            />
          }
          onSubmit={() => form.handleSubmit(onSubmit)()}
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
            isDisabled={isUpdating}
            mutation={updatePermissions}
          />
        </EditRow>
      </CustomFormProvider>
    </Stack>
  );
}
