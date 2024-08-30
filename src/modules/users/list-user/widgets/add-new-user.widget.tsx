import { Button, HStack, SimpleGrid, Stack, Tooltip, Icon, Center } from '@chakra-ui/react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import { useCreateUserHook } from '../hooks/mutations';

import type { IRole } from '../apis/get-roles.api';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomPhoneInput,
  ModalBase,
} from '@/components/elements';
import { GENDER_OPTIONS } from '@/configs';

export interface AddNewUserWidgetProps {
  children: React.ReactElement;
  roles: IRole[];
}

export function AddNewUserWidget(props: AddNewUserWidgetProps) {
  const { children, roles } = props;

  const { data, formCreateUser, handleCreateUser, isLoading, reset } = useCreateUserHook();

  const {
    register,
    control,
    formState: { errors },
  } = formCreateUser;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Thêm mới người dùng"
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-user" w={20} type="submit" isDisabled={isLoading}>
          Save
        </Button>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider id="form-create-user" form={formCreateUser} onSubmit={handleCreateUser}>
        <Stack spacing={5}>
          <CustomInput
            label="Email"
            type="email"
            isRequired
            registration={register('email')}
            error={errors.email}
          />
          <SimpleGrid columns={2} spacing={3}>
            <CustomInput
              label="Full name"
              isRequired
              registration={register('fullName')}
              error={errors.fullName}
            />
            <CustomInput
              label="Alias name"
              isRequired
              registration={register('userName')}
              error={errors.userName}
            />
          </SimpleGrid>{' '}
          <CustomInput
            label="Password"
            type="password"
            isRequired
            registration={register('password')}
            error={errors.password}
          />
          <SimpleGrid columns={2} spacing={3}>
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
          </SimpleGrid>{' '}
          <CustomPhoneInput
            specialLabel="Phone number *"
            placeholder="Phone number "
            control={control}
            name="phone"
          />
          <CustomInput
            label="Address"
            isRequired
            registration={register('address')}
            error={errors.address}
          />
          <HStack align="stretch">
            <CustomChakraReactSelect
              isSearchable={false}
              isRequired
              placeholder="Choose role"
              label="Role"
              size="lg"
              options={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
              control={control}
              name="role"
            />
          </HStack>
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
