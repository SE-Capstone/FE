import { useEffect, useState } from 'react';

import { Button, Icon, IconButton, Stack, Text } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetGroupPermissions } from '../apis/get-permissions.api';
import { useGetRole } from '../apis/get-role-detail.api';
import { useUpdateRoleMutation } from '../apis/update-role.api';
import { updateRoleFormSchema } from '../validations/update-role.validation';
import { ListPermissionWidget } from '../widgets/list-permission.widget';

import type { UpdateRoleFormType } from '../validations/update-role.validation';

import { CustomFormProvider, CustomInput, CustomTextArea } from '@/components/elements';
import { CustomEditableInput } from '@/components/elements/form/custom-editable-input';
import { EditRow } from '@/components/widgets';
import { defaultRoles } from '@/configs';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';

export function DetailRolePage() {
  const navigate = useNavigate();
  const [isDefaultRole, setIsDefaultRole] = useState(false);
  const { roleId } = useParams();
  const [triggerClose, setTriggerClose] = useState(false);

  const {
    role,
    isError: isRoleDetailError,
    isLoading: isRoleDetailLoading,
  } = useGetRole({ roleId: roleId || '' });
  const { groupPermissions, isError, isLoading } = useGetGroupPermissions();

  function onClose() {
    setTriggerClose(!triggerClose);
  }

  const { mutate: updateRoleMutation, isPending: isUpdating } = useUpdateRoleMutation({
    onClose,
  });

  const form = useFormWithSchema({
    schema: updateRoleFormSchema,
  });

  const { formState, register, reset } = form;
  const { errors, dirtyFields } = formState;

  useEffect(() => {
    setIsDefaultRole(defaultRoles.includes(role?.name || ''));
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
      notify({ type: 'error', message: 'At least one permission must be selected' });
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
    <Stack spacing={3}>
      <Stack
        bg="white"
        direction="row"
        rounded={2.5}
        p={5}
        flex={1}
        justify="space-between"
        alignItems="center"
      >
        <Text fontSize="x-large">{role?.name}</Text>
        <Stack direction="row">
          <Button variant="ghost" w="fit-content" onClick={() => navigate(-1)}>
            Back
          </Button>
          <IconButton
            aria-label="DeleteRole"
            variant="ghost"
            size="md"
            icon={<Icon as={BiTrash} boxSize={4} color="red.400" />}
          />
        </Stack>
      </Stack>
      <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
        <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={onSubmit}>
          <CustomEditableInput
            title="Role name"
            isLoading={isRoleDetailLoading}
            isDisabled={isUpdating}
            isDirty={!dirtyFields.name}
            initialValue={role?.name || ''}
            isDefaultRole={isDefaultRole}
            triggerClose={triggerClose}
            inputChildren={
              <CustomInput
                isRequired
                placeholder="Enter role name"
                registration={register('name')}
                error={errors.name}
              />
            }
            onSubmit={() =>
              form.handleSubmit(() =>
                onSubmit({
                  name: form.getValues('name'),
                  description: role?.description || '',
                })
              )()
            }
          />
          <CustomEditableInput
            title="Description"
            isLoading={isRoleDetailLoading}
            isDisabled={isUpdating}
            isDefaultRole={isDefaultRole}
            isDirty={!dirtyFields.description}
            initialValue={role?.description || ''}
            triggerClose={triggerClose}
            inputChildren={
              <CustomTextArea
                isRequired
                placeholder="Enter description"
                registration={register('description')}
                error={errors.description}
              />
            }
            onSubmit={() =>
              form.handleSubmit(() =>
                onSubmit({
                  name: role?.name || '',
                  description: form.getValues('description'),
                })
              )()
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
              isDefaultRole={isDefaultRole}
              isDisabled={isUpdating}
              mutation={updatePermissions}
              triggerClose={triggerClose}
            />
          </EditRow>
        </CustomFormProvider>
      </Stack>
    </Stack>
  );
}
