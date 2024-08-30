import { useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { useGetRoles, type IRole } from '../../list-user/apis/get-roles.api';

import type { IUser } from '../../list-user/types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomPhoneInput,
  Head,
} from '@/components/elements';
import { PreviewImage } from '@/components/elements/preview-image';
import { EditRow } from '@/components/widgets';
import { getStorageUrl } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { useUpdateProfileMutation } from '@/modules/profile/apis/update-profile.api';
import { profileUpdateFormSchema } from '@/modules/profile/validation';

export function BaseInformationUserWidget({ detailUserData }: { detailUserData?: IUser }) {
  const userId = detailUserData?.id || 0;

  // const { handleUpdateUser, formUpdateUser, updateUserResult } = useUpdateProfileMutation();
  const { mutate: updateProfileMutation, isPending: isLoading } = useUpdateProfileMutation();
  // const {
  //   reset,
  //   register,
  //   control,
  //   formState: { errors, isDirty },
  // } = profileUpdateFormSchema;

  const form = useFormWithSchema({
    schema: profileUpdateFormSchema,
  });
  const [roles, setRoles] = useState<IRole[]>([]);

  const { roles: listRole } = useGetRoles({});

  useEffect(() => {
    setRoles(listRole);
  }, [listRole]);

  const { formState, register, reset, control } = form;
  const { errors, isDirty } = formState;

  useEffect(() => {
    reset(
      {
        ...detailUserData,
      },
      {
        keepDirty: false,
      }
    );
  }, [reset, detailUserData]);

  return (
    <Box bg="white" rounded={2} w="full" p={4}>
      <CustomFormProvider form={form} isDisabled={isLoading} onSubmit={() => undefined}>
        <Stack spacing={5}>
          <EditRow title="Hình ảnh người dùng">
            {detailUserData?.avatar ? (
              <PreviewImage>
                {({ openPreview }) => (
                  <Image
                    cursor="pointer"
                    src={detailUserData?.avatar ? detailUserData?.avatar : undefined}
                    boxSize={30}
                    rounded={1}
                    onClick={() => {
                      if (!detailUserData?.avatar) return;
                      openPreview(getStorageUrl(detailUserData?.avatar), 'nkjdafb');
                    }}
                  />
                )}
              </PreviewImage>
            ) : (
              <Text color="red.300">Chưa có ảnh</Text>
            )}
          </EditRow>

          <EditRow title="Tên người dùng">
            <SimpleGrid columns={2} w="70%" spacing={5}>
              <CustomInput
                inputLeftAddon="Họ: "
                registration={register('fullName')}
                error={errors.fullName}
              />
            </SimpleGrid>
          </EditRow>

          <EditRow title="Số điện thoại">
            <Box w="40%">
              <CustomPhoneInput control={control} name="phone" />
            </Box>
          </EditRow>

          <Box w="70%" minW="200px">
            <EditRow title="Vai trò">
              <CustomChakraReactSelect
                isSearchable
                placeholder="Choose role"
                options={roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
                control={control}
                name="role"
              />
            </EditRow>
          </Box>

          <EditRow title="">{/* <Text>{detailUserData?.customerOnShop?.name}</Text> */}</EditRow>
        </Stack>
        <HStack justify="flex-end" my={10}>
          <ButtonGroup spacing={2}>
            <Button type="submit" isDisabled={!isDirty || isLoading}>
              Cập nhật
            </Button>
          </ButtonGroup>
        </HStack>
      </CustomFormProvider>
    </Box>
  );
}
