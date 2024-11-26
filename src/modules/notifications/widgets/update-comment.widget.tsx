import { Flex, Stack, Icon, Avatar, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsDot } from 'react-icons/bs';

import type { UpdateCommentData, INotification } from '../types';

import { CustomLink } from '@/components/elements';
import { timeAgo } from '@/libs/helpers';
import { APP_PATHS } from '@/routes/paths/app.paths';

const UpdateCommentNotification = ({
  notification,
  data,
  callback,
}: {
  notification: INotification;
  data: UpdateCommentData;
  callback: (id: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Flex
      w="100%"
      justifyContent="space-between"
      _hover={{
        bg: 'gray.50',
      }}
      cursor="pointer"
      pl={4}
      py={3}
      alignItems="center"
      onClick={() => !notification.hasRead && callback(notification.id)}
    >
      <CustomLink display="flex" to={APP_PATHS.detailIssue(data.projectId, data.issueId)}>
        <Stack spacing={0} direction="row" alignItems="center">
          <Flex pr={2}>
            <Avatar size="md" name={data.commenterUsername} src={data.commenterAvatar} />
          </Flex>
          <Flex direction="column" p={2}>
            <Text fontSize="sm" fontWeight="600">
              {t('notifications.updateComment', {
                commenterName: data.commenterName,
              })}
            </Text>
            <Text fontSize="sm">{data.issueName}</Text>
            <Text fontSize="12px" color="gray.300">
              #{data.issueIndex} &#8226; {data.issueStatusName}
            </Text>
            <Text fontSize="sm" color="#949cac">
              {timeAgo(notification.createdAt.toString(), t)}
            </Text>
          </Flex>
        </Stack>
        {!notification.hasRead && <Icon as={BsDot} w={10} h={10} color="blue.400" />}
      </CustomLink>
    </Flex>
  );
};

export default UpdateCommentNotification;
