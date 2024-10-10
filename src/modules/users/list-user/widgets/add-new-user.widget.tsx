import { useEffect, useState } from 'react';

import { Button, HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { useCreateUserHook } from '../hooks/mutations';

import type { IPosition } from '@/modules/positions/types';
import type { IRole } from '@/modules/roles/list-role/types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  ModalBase,
} from '@/components/elements';
import { GENDER_OPTIONS } from '@/configs';
import { phoneNumberAutoFormat } from '@/libs/helpers';
import { useGetListPositionQuery } from '@/modules/positions/hooks/queries';

export interface AddNewUserWidgetProps {
  children: React.ReactElement;
  roles: IRole[];
}

export function AddNewUserWidget(props: AddNewUserWidgetProps) {
  const { children, roles } = props;

  const { data, formCreateUser, handleCreateUser, isLoading, reset } = useCreateUserHook();

  const [positions, setPositions] = useState<IPosition[]>([]);
  const { listPosition, isLoading: isLoadingPosition } = useGetListPositionQuery();

  useEffect(() => {
    if (JSON.stringify(positions) !== JSON.stringify(listPosition)) {
      setPositions(listPosition);
    }
  }, [listPosition, positions]);

  const {
    register,
    control,
    formState: { errors },
  } = formCreateUser;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Create user"
      triggerButton={() => children}
      renderFooter={() => (
        <Button
          form="form-create-user"
          w={20}
          type="submit"
          isDisabled={isLoading || isLoadingPosition}
        >
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
          </SimpleGrid>
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
          </SimpleGrid>
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
          <CustomInput
            label="Address"
            isRequired
            registration={register('address')}
            error={errors.address}
          />
          <HStack align="stretch">
            <CustomChakraReactSelect
              isSearchable
              isRequired
              placeholder="Choose role"
              label="Role"
              size="lg"
              options={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
              control={control}
              name="roleId"
            />
            <CustomChakraReactSelect
              isSearchable
              isRequired
              placeholder="Choose position"
              label="Position"
              size="lg"
              options={positions.map((position) => ({
                label: position.name,
                value: position.id,
              }))}
              control={control}
              name="positionId"
            />
          </HStack>
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
