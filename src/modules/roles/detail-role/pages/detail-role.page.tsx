import { useEffect, useState } from 'react';

import { Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useGetGroupPermissions } from '../apis/get-permissions.api';
import { useGetRole } from '../apis/get-role-detail.api';
import { useUpdateRoleMutation } from '../apis/update-role.api';
import { InlineEditRoleSelect } from '../components/editable-dropdown.widget';
import { updateRoleFormSchema } from '../validations/update-role.validation';
import { ListPermissionWidget } from '../widgets/list-permission.widget';

import type { UpdateRoleFormType } from '../validations/update-role.validation';

import { CustomFormProvider, CustomInput, CustomTextArea } from '@/components/elements';
import { CustomEditableInput } from '@/components/elements/form/custom-editable-input';
import { LayoutBack } from '@/components/layouts';
import { EditRow } from '@/components/widgets';
import { COLOR_OPTIONS, PermissionEnum } from '@/configs';
import { notify } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { BadgeIssue as BadgeRole } from '@/modules/issues/list-issue/components';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function DetailRolePage() {
  const { t } = useTranslation();
  const { permissions, currentUser } = useAuthentication();
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
        color: role.color,
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
        color: role.color,
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
        {/* <IconButton
          hidden={!permissions[PermissionEnum.UPSERT_ROLE]}
          aria-label="UpsertRole"
          variant="ghost"
          size="md"
          icon={<Icon as={BiTrash} boxSize={4} color="red.400" />}
        /> */}
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        <></>
      </LayoutBack>
      <Stack bg="white" p={5} flex={1} flexBasis="10%" rounded={2.5} justify="center" spacing={2}>
        <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={onSubmit}>
          <CustomEditableInput
            title={t('fields.name')}
            isLoading={isRoleDetailLoading}
            isDisabled={isUpdating}
            isDirty={!dirtyFields.name}
            initialValue={role?.name || ''}
            isEditable={
              !permissions[PermissionEnum.UPSERT_ROLE] ||
              role?.name === 'ADMIN' ||
              role?.name === currentUser?.roleName
            }
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
            isEditable={
              !permissions[PermissionEnum.UPSERT_ROLE] ||
              role?.name === 'ADMIN' ||
              role?.name === currentUser?.roleName
            }
            isDirty={!dirtyFields.description}
            initialValue={role?.description || ''}
            triggerClose={triggerClose}
            inputChildren={
              <CustomTextArea
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
            title={t('fields.theme')}
            stackProps={{
              maxW: 25,
              justifyContent: 'end',
              alignSelf: 'start',
            }}
          >
            <Stack
              maxW={{
                base: '100%',
                md: '100%',
                lg: '60%',
              }}
            >
              <InlineEditRoleSelect
                options={COLOR_OPTIONS.map((color) => ({
                  label: <BadgeRole content="Role" colorScheme={color} />,
                  value: color,
                }))}
                defaultValue={
                  role?.color && {
                    label: <BadgeRole content="Role" colorScheme={role.color} />,
                    value: role.color,
                  }
                }
                role={role}
                isDisabled={
                  !permissions[PermissionEnum.UPSERT_ROLE] ||
                  role?.name === 'ADMIN' ||
                  role?.name === currentUser?.roleName
                }
              />
            </Stack>
          </EditRow>
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
              isEditable={
                !permissions[PermissionEnum.UPSERT_ROLE] ||
                role?.name === 'ADMIN' ||
                role?.name === currentUser?.roleName
              }
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
