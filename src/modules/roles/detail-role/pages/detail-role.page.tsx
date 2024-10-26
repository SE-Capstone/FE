import { useEffect, useState } from 'react';

import { Icon, IconButton, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { useParams } from 'react-router-dom';

import { useGetGroupPermissions } from '../apis/get-permissions.api';
import { useGetRole } from '../apis/get-role-detail.api';
import { useUpdateRoleMutation } from '../apis/update-role.api';
import { updateRoleFormSchema } from '../validations/update-role.validation';
import { ListPermissionWidget } from '../widgets/list-permission.widget';

import type { UpdateRoleFormType } from '../validations/update-role.validation';

import { CustomFormProvider, CustomInput, CustomTextArea } from '@/components/elements';
import { CustomEditableInput } from '@/components/elements/form/custom-editable-input';
import { LayoutBack } from '@/components/layouts';
import { EditRow } from '@/components/widgets';
import { PermissionEnum } from '@/configs';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function DetailRolePage() {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
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
    schema: updateRoleFormSchema(t),
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
      notify({ type: 'error', message: t('validation.permissionRequired') });
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
      <LayoutBack
        display="flex"
        flexDir="row"
        justify="space-between"
        alignItems="center"
        py="14px"
        title={role?.name}
        path={APP_PATHS.listRole}
      >
        <IconButton
          // Todo: fix
          hidden={!permissions[PermissionEnum.ADD_ROLE]}
          aria-label="DeleteRole"
          variant="ghost"
          size="md"
          icon={<Icon as={BiTrash} boxSize={4} color="red.400" />}
        />
      </LayoutBack>
      <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
        <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={onSubmit}>
          <CustomEditableInput
            title={t('fields.name')}
            isLoading={isRoleDetailLoading}
            isDisabled={isUpdating}
            isDirty={!dirtyFields.name}
            initialValue={role?.name || ''}
            // Todo: fix
            isEditable={!permissions[PermissionEnum.ADD_ROLE]}
            triggerClose={triggerClose}
            inputChildren={
              <CustomInput
                isRequired
                placeholder={`${t('common.enter')} ${t('fields.name')}`}
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
            title={t('fields.description')}
            isLoading={isRoleDetailLoading}
            isDisabled={isUpdating}
            // Todo: fix
            isEditable={!permissions[PermissionEnum.ADD_ROLE]}
            isDirty={!dirtyFields.description}
            initialValue={role?.description || ''}
            triggerClose={triggerClose}
            inputChildren={
              <CustomTextArea
                isRequired
                placeholder={`${t('common.enter')} ${t('fields.description')}`}
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
            title={t('fields.permission')}
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
              // Todo: fix
              isEditable={!permissions[PermissionEnum.ADD_ROLE]}
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
