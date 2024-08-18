import { Avatar, Button, Icon, Stack, Text } from '@chakra-ui/react';
import { MdModeEditOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { InfoCard } from '../components';
import { useAuthentication } from '../hooks';

import type { RolesEnum } from '@/configs';

import { Head } from '@/components/elements';
import { PreviewImage } from '@/components/elements/preview-image';
import { getStorageUrl } from '@/libs/helpers';
import { BadgeRole } from '@/modules/users/detail-user/components';

export function ProfilePage() {
  const { currentUser, role } = useAuthentication();

  const infoData = [
    {
      label: 'Tên',
      text: currentUser?.fullName || '',
    },
    {
      label: 'Số điện thoại',
      text: currentUser?.phone || '',
    },
    {
      label: 'Địa chỉ',
      text: currentUser?.address || '',
    },
    {
      label: 'Vai trò',
      text: <BadgeRole role={role as unknown as RolesEnum} />,
    },
  ];

  return (
    <>
      <Head title="Trang cá nhân" />
      <Stack
        direction={{ base: 'column-reverse', xl: 'row' }}
        alignItems="stretch"
        spacing="24px"
        w="100%"
      >
        <Stack w="full" spacing="24px" flex={3}>
          <Stack padding="24px" borderRadius="8px" direction="column" spacing="24px" bg="white">
            <Text
              sx={{
                fontWeight: 'semibold',
                fontSize: '20px',
                lineHeight: '27px',
                paddingBottom: '24px',
                borderBottom: '1px solid',
                borderColor: 'neutral.500',
              }}
            >
              Thông tin cá nhân
            </Text>
            <InfoCard data={infoData} />
            <Stack />
          </Stack>
        </Stack>

        <Stack
          bg="white"
          p={5}
          flex={1}
          flexBasis="10%"
          rounded={2.5}
          justify="center"
          align="center"
          spacing={3}
        >
          <PreviewImage>
            {({ openPreview }) => (
              <Avatar
                boxSize={40}
                objectFit="cover"
                src={getStorageUrl(currentUser?.avatar as string)}
                cursor={currentUser?.avatar ? 'pointer' : 'default'}
                onClick={
                  currentUser?.avatar
                    ? () =>
                        openPreview(
                          getStorageUrl(currentUser?.avatar as string),
                          currentUser.fullName || ''
                        )
                    : undefined
                }
              />
            )}
          </PreviewImage>
          <Button
            as={Link}
            to="edit"
            size="md"
            variant="ghost"
            leftIcon={<Icon as={MdModeEditOutline} boxSize={5} />}
          >
            Chỉnh sửa
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
