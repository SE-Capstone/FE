import { Flex, Stack, Icon, Avatar, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsDot } from 'react-icons/bs';

import type { AssignLeaderData, INotification } from '../types';

import { timeAgo } from '@/libs/helpers';

const AssignLeaderNotification = ({
  notification,
  data,
  callback,
}: {
  notification: INotification;
  data: AssignLeaderData;
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
      px={4}
      py={3}
      alignItems="center"
      onClick={() => !notification.hasRead && callback(notification.id)}
    >
      <Stack spacing={0} direction="row" alignItems="center">
        <Flex>
          <Avatar size="md" name={data.assignerUsername} src={data.assignerAvatar} />
        </Flex>
        <Flex direction="column" p={2}>
          <Text fontSize="sm" fontWeight="600">
            {t('notifications.assignLeader', {
              assignerName: data.assignerName,
              projectName: data.projectName,
            })}
          </Text>
          <Text fontSize="sm" color="#949cac">
            {timeAgo(notification.createdAt.toString(), t)}
          </Text>
        </Flex>
      </Stack>
      {!notification.hasRead && (
        <Flex>
          <Icon as={BsDot} w={10} h={10} color="blue.400" />
        </Flex>
      )}
    </Flex>
  );
};

export default AssignLeaderNotification;
