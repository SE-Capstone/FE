import { useEffect, useState } from 'react';

import { Box, Button, HStack, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useUpdateUserMutation } from '../apis/update-user.api';
import { updateUserFormSchema } from '../validations/update-user.validation';

import type { IUser } from '../../list-user/types';
import type { UpdateUserFormType } from '../validations/update-user.validation';
import type { IPosition } from '@/modules/positions/types';
import type { IBank } from '@/modules/profile/apis/get-banks.api';
import type { IRole } from '@/modules/roles/list-role/types';

import { CustomChakraReactSelect, CustomFormProvider, CustomInput } from '@/components/elements';
import { PreviewImage } from '@/components/elements/preview-image';
import { EditRow } from '@/components/widgets';
import { GENDER_OPTIONS, PermissionEnum, UserStatusEnum } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import {
  cleanPhoneNumber,
  formatDate,
  getCurrentDate,
  phoneNumberAutoFormat,
} from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { BadgeIssue, BadgeIssue as BadgeRole } from '@/modules/issues/list-issue/components';
import { useGetListPositionQuery } from '@/modules/positions/hooks/queries';
import { useGetBanks } from '@/modules/profile/apis/get-banks.api';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetRoles } from '@/modules/roles/list-role/apis/get-roles.api';

export function BaseInformationUserWidget({ user }: { user?: IUser }) {
  const { t } = useTranslation();
  const userId = user?.id;
  const { permissions } = useAuthentication();

  const { mutate: updateUserMutation, isPending: isLoading } = useUpdateUserMutation();

  const form = useFormWithSchema({
    schema: updateUserFormSchema(t),
  });
  const [banks, setBanks] = useState<IBank[]>([]);
  const { banks: listBank } = useGetBanks();

  useEffect(() => {
    if (banks) {
      setBanks(listBank);
    }
  }, [banks, listBank]);

  const [roles, setRoles] = useState<IRole[]>([]);
  const [positions, setPositions] = useState<IPosition[]>([]);
  const { roles: listRole } = useGetRoles({
    enabled: !!permissions[PermissionEnum.READ_LIST_ROLE],
  });
  const { listPosition, isLoading: isLoadingPosition } = useGetListPositionQuery();

  useEffect(() => {
    if (JSON.stringify(roles) !== JSON.stringify(listRole)) {
      setRoles(listRole);
    }
  }, [listRole, roles]);

  useEffect(() => {
    if (JSON.stringify(positions) !== JSON.stringify(listPosition)) {
      setPositions(listPosition);
    }
  }, [listPosition, positions]);

  const { formState, register, reset, control } = form;
  const { errors, isDirty } = formState;

  const { openAlert, closeAlert } = useAlertDialogStore(isLoading);

  function onSubmit(values: UpdateUserFormType) {
    if (isLoading || isLoadingPosition) return;

    openAlert({
      title: t('common.edit'),
      description: `${t('actions.updateUser')} "${user?.fullName}"?`,
      onHandleConfirm() {
        updateUserMutation({
          body: {
            ...values,
            id: userId || '',
            phone: cleanPhoneNumber(values.phone),
            dob: formatDate({
              date: values.dob,
              format: 'YYYY-MM-DD',
            }),
          },
        });

        closeAlert();
      },
    });
  }

  useEffect(() => {
    reset(
      {
        ...user,
        roleId: user?.roleId,
        dob: user?.dob
          ? (formatDate({
              date: user?.dob,
              format: 'YYYY-MM-DD',
            }) as unknown as Date)
          : (getCurrentDate() as unknown as Date),
      },
      {
        keepDirty: false,
      }
    );
  }, [reset, user]);

  return (
    <Box bg="white" rounded={2} w="full">
      <CustomFormProvider
        form={form}
        isDisabled={!permissions[PermissionEnum.UPDATE_USER]}
        style={{ height: 'fit-content' }}
        onSubmit={onSubmit}
      >
        <Stack
          direction={{ base: 'column-reverse' }}
          spacing="24px"
          w="100%"
          alignItems="flex-start"
        >
          <Stack direction="column" w="100%" spacing="24px">
            <Stack spacing={5}>
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 2, md: 6 }}
                alignItems="start"
              >
                <CustomInput
                  label={t('fields.fullName')}
                  isRequired
                  placeholder={`${t('common.enter')} ${t('fields.fullName')}`}
                  registration={register('fullName')}
                  error={errors?.fullName}
                />
                <CustomInput label="Email" value={user?.email} disabled />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <CustomInput
                      label={t('fields.phone')}
                      placeholder="012-345-6789"
                      isRequired
                      error={errors?.phone}
                      value={value ?? ''}
                      maxLength={12}
                      onChange={(e) => {
                        onChange(phoneNumberAutoFormat(e.target.value));
                      }}
                      {...field}
                    />
                  )}
                />
                <CustomChakraReactSelect
                  isRequired
                  isSearchable={false}
                  label={t('fields.gender')}
                  isDisabled={!permissions[PermissionEnum.UPDATE_USER]}
                  options={GENDER_OPTIONS}
                  control={control}
                  name="gender"
                />
                <CustomInput
                  label={t('fields.birthday')}
                  isRequired
                  type="date"
                  registration={register('dob')}
                  error={errors.dob}
                />
                <CustomChakraReactSelect
                  isRequired
                  isSearchable
                  isDisabled={!permissions[PermissionEnum.UPDATE_USER]}
                  label={`${t('common.choose')} ${t('fields.status').toLowerCase()}`}
                  options={[
                    {
                      label: <BadgeIssue content="Active" colorScheme="green" />,
                      value: UserStatusEnum.Active,
                    },
                    {
                      label: <BadgeIssue content="Inactive" colorScheme="red" />,
                      value: UserStatusEnum.Inactive,
                    },
                  ]}
                  control={control}
                  name="status"
                />
                <CustomInput label={t('fields.bankAccount')} value={user?.bankAccount} disabled />
                <CustomInput
                  label={t('fields.bankAccountName')}
                  value={user?.bankAccountName}
                  disabled
                />
              </SimpleGrid>
            </Stack>
            <HStack align="stretch">
              <CustomChakraReactSelect
                isSearchable
                label={t('fields.role')}
                isDisabled={!permissions[PermissionEnum.UPDATE_USER]}
                options={roles.map((role) => ({
                  label: <BadgeRole content={role.name} colorScheme={role.color} />,
                  value: role.id,
                }))}
                control={control}
                name="roleId"
              />
              {/* <CustomChakraReactSelect
                isSearchable
                isRequired
                placeholder={`${t('common.choose')} ${t('common.position').toLowerCase()}`}
                label={t('common.position')}
                options={positions.map((position) => ({
                  label: position.name,
                  value: position.id,
                }))}
                control={control}
                name="positionId"
              /> */}
            </HStack>
            <CustomInput
              label={t('fields.address')}
              isRequired
              registration={register('address')}
              error={errors?.address}
            />
            <Stack align="center">
              <Button
                w="150px"
                maxW="100%"
                type="submit"
                isDisabled={isLoading || !isDirty}
                isLoading={isLoading}
              >
                {t('common.save')}
              </Button>
            </Stack>
          </Stack>
          <EditRow title="Avatar">
            {user?.avatar ? (
              <PreviewImage>
                {({ openPreview }) => (
                  <Image
                    cursor="pointer"
                    src={user?.avatar ? user?.avatar : undefined}
                    boxSize={30}
                    rounded={1}
                    onClick={() => {
                      if (!user?.avatar) return;
                      openPreview(user?.avatar, '');
                    }}
                  />
                )}
              </PreviewImage>
            ) : (
              <Text color="red.300">{t('fields.noImage')}</Text>
            )}
          </EditRow>
        </Stack>
      </CustomFormProvider>
    </Box>
  );
}
