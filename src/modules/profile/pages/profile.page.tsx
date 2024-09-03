import { Avatar, Button, Icon, Stack, Text } from '@chakra-ui/react';
import { MdModeEditOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { InfoCard } from '../components';
import { useAuthentication } from '../hooks';

import { Head } from '@/components/elements';
import { PreviewImage } from '@/components/elements/preview-image';
import { getGender, type RolesEnum } from '@/configs';
import { formatDate, phoneNumberAutoFormat } from '@/libs/helpers';
import { BadgeRole } from '@/modules/users/detail-user/components';

export function ProfilePage() {
  const { currentUser } = useAuthentication();

  const infoData = [
    {
      label: 'Full name',
      text: currentUser?.fullName || '',
    },
    {
      label: 'Email',
      text: currentUser?.email || '',
    },
    {
      label: 'Phone number',
      text: phoneNumberAutoFormat(currentUser?.phone || ''),
    },
    {
      label: 'Address',
      text: currentUser?.address || '',
    },
    {
      label: 'Role',
      text: <BadgeRole role={currentUser?.roleName as unknown as RolesEnum} />,
    },
    {
      label: 'Gender',
      text: getGender(currentUser?.gender),
    },
    {
      label: 'Birthday',
      text: currentUser?.dob ? formatDate({ date: currentUser?.dob, format: 'DD-MM-YYYY' }) : '',
    },
    {
      label: 'Bank account number',
      text: currentUser?.bankAccount || '',
    },
    {
      label: 'Bank account name',
      text: currentUser?.bankAccountName || '',
    },
  ];

  return (
    <>
      <Head title="Personal page" />
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
              Personal information
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
                src={currentUser?.avatar}
                cursor={currentUser?.avatar ? 'pointer' : 'default'}
                onClick={
                  currentUser?.avatar
                    ? () => openPreview(currentUser?.avatar || '', currentUser.fullName || '')
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
            Edit
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
