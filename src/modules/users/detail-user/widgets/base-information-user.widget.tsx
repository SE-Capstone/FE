import { useEffect, useState } from 'react';

import { Box, Button, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { useUpdateUserMutation } from '../apis/update-user.api';
import { updateUserFormSchema } from '../validations/update-user.validation';

import type { IUser } from '../../list-user/types';
import type { UpdateUserFormType } from '../validations/update-user.validation';
import type { IBank } from '@/modules/profile/apis/get-banks.api';
import type { IRole } from '@/modules/roles/list-role/types';

import { CustomChakraReactSelect, CustomFormProvider, CustomInput } from '@/components/elements';
import { PreviewImage } from '@/components/elements/preview-image';
import { EditRow } from '@/components/widgets';
import { GENDER_OPTIONS, USER_STATUS_OPTIONS } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import {
  cleanPhoneNumber,
  formatDate,
  getCurrentDate,
  phoneNumberAutoFormat,
} from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { useGetBanks } from '@/modules/profile/apis/get-banks.api';
import { useGetRoles } from '@/modules/roles/list-role/apis/get-roles.api';

export function BaseInformationUserWidget({ user }: { user?: IUser }) {
  const userId = user?.id;

  const { mutate: updateUserMutation, isPending: isLoading } = useUpdateUserMutation();

  const form = useFormWithSchema({
    schema: updateUserFormSchema,
  });
  const [banks, setBanks] = useState<IBank[]>([]);
  const { banks: listBank } = useGetBanks();

  useEffect(() => {
    if (banks) {
      setBanks(listBank);
    }
  }, [banks, listBank]);

  const [roles, setRoles] = useState<IRole[]>([]);

  const { roles: listRole } = useGetRoles({});

  useEffect(() => {
    if (JSON.stringify(roles) !== JSON.stringify(listRole)) {
      setRoles(listRole);
    }
  }, [listRole, roles]);

  const { formState, register, reset, control } = form;
  const { errors, isDirty } = formState;

  const { openAlert, closeAlert } = useAlertDialogStore(isLoading);

  function onSubmit(values: UpdateUserFormType) {
    if (isLoading) return;

    openAlert({
      title: 'Update',
      description: `Are you sure to update user "${user?.fullName}"?`,
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
      <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={onSubmit}>
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
                  label="Full name"
                  isRequired
                  placeholder="Enter full name"
                  registration={register('fullName')}
                  error={errors?.fullName}
                />
                <CustomInput label="Email" value={user?.email} disabled />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <CustomInput
                      label="Phone number"
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
                  label="Gender"
                  options={GENDER_OPTIONS}
                  control={control}
                  name="gender"
                />
                <CustomInput
                  label="Birthday"
                  isRequired
                  type="date"
                  registration={register('dob')}
                  error={errors.dob}
                />
                <CustomChakraReactSelect
                  isRequired
                  isSearchable
                  label="Choose status"
                  options={USER_STATUS_OPTIONS}
                  control={control}
                  name="status"
                />
                <CustomInput label="Bank account number" value={user?.bankAccount} disabled />
                <CustomInput label="Bank account name" value={user?.bankAccountName} disabled />
              </SimpleGrid>
            </Stack>
            <CustomInput
              label="Address"
              isRequired
              registration={register('address')}
              error={errors?.address}
            />
            <CustomChakraReactSelect
              isRequired
              isSearchable
              label="Choose role"
              options={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
              control={control}
              name="roleId"
            />
            <Stack align="center">
              <Button
                w="150px"
                maxW="100%"
                type="submit"
                isDisabled={isLoading || !isDirty}
                isLoading={isLoading}
              >
                Save
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
              <Text color="red.300">No image</Text>
            )}
          </EditRow>
        </Stack>
      </CustomFormProvider>
    </Box>
  );
}
