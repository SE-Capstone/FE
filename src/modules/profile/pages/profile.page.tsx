import { Avatar, Button, Icon, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdModeEditOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { InfoCard } from '../components';
import { useAuthentication } from '../hooks';

import { Head } from '@/components/elements';
import { PreviewImage } from '@/components/elements/preview-image';
import { getGender } from '@/configs';
import { formatDate, phoneNumberAutoFormat } from '@/libs/helpers';
import { BadgeIssue } from '@/modules/issues/list-issue/components';

export function ProfilePage() {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();

  const infoData = [
    {
      label: t('fields.fullName'),
      text: currentUser?.fullName || '',
    },
    {
      label: t('fields.aliasName'),
      text: currentUser?.userName || '',
    },
    {
      label: 'Email',
      text: currentUser?.email || '',
    },
    {
      label: t('fields.phone'),
      text: phoneNumberAutoFormat(currentUser?.phone || ''),
    },
    {
      label: t('fields.address'),
      text: currentUser?.address || '',
    },
    {
      label: t('fields.role'),
      text: currentUser?.roleName && currentUser?.roleColor && (
        <BadgeIssue content={currentUser.roleName} colorScheme={currentUser.roleColor} />
      ),
    },
    {
      label: t('fields.gender'),
      text: getGender(t, currentUser?.gender),
    },
    {
      label: t('fields.birthday'),
      text: currentUser?.dob ? formatDate({ date: currentUser?.dob, format: 'DD-MM-YYYY' }) : '',
    },
    {
      label: t('fields.bankAccount'),
      text: currentUser?.bankAccount || '',
    },
    {
      label: t('fields.bankAccountName'),
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
              {t('header.personalInformation')}
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
            {t('common.edit')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
