import type React from 'react';
import { useEffect, useState } from 'react';

import { Avatar, Button, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineFileUpload } from 'react-icons/md';

import { useGetBanks } from '../apis/get-banks.api';
import { useUpdateProfileMutation } from '../apis/update-profile.api';
import { useAuthentication } from '../hooks';
import { profileUpdateFormSchema } from '../validation/profile.validation';
import { ChangePasswordWidget } from '../widgets/change-password.widget';

import type { IBank } from '../apis/get-banks.api';
import type { ProfileUpdateFormType } from '../validation/profile.validation';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  FileUpload,
  Head,
} from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { GENDER_OPTIONS, GenderEnum } from '@/configs';
import {
  cleanPhoneNumber,
  formatDate,
  getCurrentDate,
  phoneNumberAutoFormat,
} from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export const EditProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();

  const { mutate: updateProfileMutation, isPending: isLoading } = useUpdateProfileMutation();
  const [banks, setBanks] = useState<IBank[]>([]);
  const { banks: listBank } = useGetBanks();

  useEffect(() => {
    if (banks) {
      setBanks(listBank);
    }
  }, [banks, listBank]);

  const form = useFormWithSchema({
    schema: profileUpdateFormSchema(t),
  });
  const initUrl = form.getValues('avatar') instanceof File ? '' : form.getValues('avatar');

  const { formState, register, reset, control } = form;
  const { errors, isSubmitting, isDirty } = formState;

  function onSubmit(values: ProfileUpdateFormType) {
    if (isLoading) return;

    if (!values?.avatar) {
      values.avatar = currentUser?.avatar;
    }

    updateProfileMutation({
      body: {
        ...values,
        phone: cleanPhoneNumber(values.phone),
        dob: formatDate({
          date: values.dob,
          format: 'YYYY-MM-DD',
        }),
      },
    });
  }

  useEffect(() => {
    if (currentUser) {
      reset(
        {
          avatar: currentUser.avatar || undefined,
          address: currentUser.address || '',
          fullName: currentUser.fullName || '',
          phone: currentUser.phone || '',
          dob: currentUser.dob
            ? (formatDate({
                date: currentUser.dob,
                format: 'YYYY-MM-DD',
              }) as unknown as Date)
            : (getCurrentDate() as unknown as Date),
          gender: currentUser.gender || GenderEnum.male,
          bankAccount: currentUser.bankAccount || '',
          bankAccountName: currentUser.bankAccountName || '',
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [currentUser, reset]);

  return (
    <>
      <Head title="Update profile" />
      <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={onSubmit}>
        <Stack
          direction={{ base: 'column-reverse', xl: 'row' }}
          spacing="24px"
          w="100%"
          alignItems="flex-start"
        >
          <LayoutBack w={{ base: 'full', xl: '70%' }} path={APP_PATHS.profile}>
            <Stack direction="column" spacing="24px">
              <Heading variant="title" mt="12px">
                {t('header.updatePersonalInformation')}
              </Heading>
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
                  <CustomInput
                    label={t('fields.bankAccount')}
                    isRequired
                    registration={register('bankAccount')}
                    error={errors?.bankAccount}
                  />
                  <CustomChakraReactSelect
                    isRequired
                    isSearchable
                    label={t('fields.bankAccountName')}
                    options={banks.map((bank) => ({
                      label: `${bank.code} - ${bank.name}`,
                      value: bank.short_name,
                    }))}
                    control={control}
                    name="bankAccountName"
                  />
                </SimpleGrid>
              </Stack>
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
          </LayoutBack>
          <FileUpload
            initUrl={initUrl instanceof File ? undefined : initUrl || undefined}
            control={control}
            name="avatar"
            error={errors?.avatar}
            trigger={() => (
              <Button
                color="secondary"
                fontWeight={500}
                size="lg"
                variant="ghost"
                leftIcon={<Icon as={MdOutlineFileUpload} boxSize={5} />}
                isDisabled={isSubmitting}
              >
                {t('common.upload')}
              </Button>
            )}
            stackProps={{ direction: 'column', align: 'flex-start', spacing: 4 }}
            controlProps={{
              bg: 'white',
              rounded: '8px',
              p: '32px',
              w: { base: 'full', xl: '30%' },
            }}
            labelProps={{
              w: 'full',
            }}
          >
            {(url) => (
              <Stack spacing={4} w="full">
                <Avatar src={url || currentUser?.avatar} boxSize={20} objectFit="cover" />
                <Text
                  sx={{
                    fontWeight: 'medium',
                    fontSize: '20px',
                    lineHeight: '27px',
                  }}
                >
                  {currentUser?.fullName || ''}
                </Text>
              </Stack>
            )}
          </FileUpload>
        </Stack>
      </CustomFormProvider>
      <ChangePasswordWidget />
    </>
  );
};
