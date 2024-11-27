import { useEffect, useRef } from 'react';

import {
  VStack,
  Divider,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  Box,
  MenuList,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaBell } from 'react-icons/fa';
import { RiCheckDoubleFill } from 'react-icons/ri';

import { useMarkReadAllMutation } from '../apis/mark-read-all.api';
import { useMarkReadMutation } from '../apis/mark-read.api';
import { useGetInfiniteNotificationQuery } from '../hooks/queries/use-get-infinite-notifications.hook';
import AssignIssueNotification from '../widgets/assign-issue.widget';
import AssignLeaderNotification from '../widgets/assign-leader.widget';
import AssignMemberNotification from '../widgets/assign-member.widget';
import CreateCommentNotification from '../widgets/create-comment.widget';
import Connector from '../widgets/signalR-connection';
import UpdateCommentNotification from '../widgets/update-comment.widget';
import UpdateIssueNotification from '../widgets/update-issue.widget';

import type { INotification } from '../types';

import { getAccessToken } from '@/libs/helpers';
import { useAuthentication } from '@/modules/profile/hooks';

const NotificationWidget = ({ notification }: { notification: INotification }) => {
  const { type, data } = notification;

  const { mutate } = useMarkReadMutation({});

  const data2 = JSON.parse(data as any) as any;
  switch (type) {
    case 'assignMember':
      if (data2.type === 'assignMember') {
        return (
          <AssignMemberNotification
            notification={notification}
            data={JSON.parse(data as any) as any}
            callback={mutate}
          />
        );
      }
      return undefined;
    case 'assignLeader':
      if (data2.type === 'assignLeader') {
        return (
          <AssignLeaderNotification notification={notification} data={data2} callback={mutate} />
        );
      }
      return undefined;
    case 'assignIssue':
      if (data2.type === 'assignIssue') {
        return (
          <AssignIssueNotification notification={notification} data={data2} callback={mutate} />
        );
      }
      return undefined;
    case 'createComment':
      if (data2.type === 'createComment') {
        return (
          <CreateCommentNotification notification={notification} data={data2} callback={mutate} />
        );
      }
      return undefined;
    case 'updateComment':
      if (data2.type === 'updateComment') {
        return (
          <UpdateCommentNotification notification={notification} data={data2} callback={mutate} />
        );
      }
      return undefined;
    case 'updateIssue':
      if (data2.type === 'updateIssue') {
        return (
          <UpdateIssueNotification notification={notification} data={data2} callback={mutate} />
        );
      }
      return undefined;
    default:
      return undefined;
  }
};

const NotificationsList = () => {
  const { t } = useTranslation();
  const accessToken = getAccessToken();
  const { currentUser } = useAuthentication();
  const containerRef = useRef<HTMLDivElement>(null);
  const { notificationEvents, connection } = Connector(accessToken || '', currentUser?.id || '');

  const {
    isLoading,
    hasMore,
    listNotification,
    unReadCount,
    refetch,
    fetchMore,
    isFetching,
    isRefetching,
  } = useGetInfiniteNotificationQuery();

  useEffect(() => {
    notificationEvents(() => {
      refetch();
    });

    return () => {
      connection.off('NotificationResponse');
    };
  });

  const { mutate } = useMarkReadAllMutation({});

  const loadMore = () => {
    if (!hasMore || isFetching || isRefetching || isLoading) return;
    fetchMore();
  };

  const handleScroll = () => {
    if (!containerRef.current || isFetching || isRefetching) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Check if the user has scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMore();
    }
  };

  return (
    <Menu isLazy>
      {({ onClose }) => (
        <>
          <MenuButton>
            <IconButton
              position="relative"
              py="2"
              bg="transparent"
              colorScheme="gray"
              aria-label="Notifications"
              size="lg"
              _hover={{
                bg: 'transparent',
              }}
              icon={
                <>
                  <FaBell fontSize="18px" color="rgb(203 197 197)" />
                  {unReadCount > 0 && (
                    <Box
                      as="span"
                      color="white"
                      position="absolute"
                      top="6px"
                      right={unReadCount < 10 ? '6px' : unReadCount > 99 ? '0px' : '3px'}
                      fontSize="10px"
                      fontWeight="bold"
                      bgColor="red"
                      borderRadius="5px"
                      zIndex={9999}
                      px="4px"
                      py="2px"
                    >
                      {unReadCount > 99 ? '+99' : unReadCount}
                    </Box>
                  )}
                </>
              }
            />
          </MenuButton>
          <MenuList borderColor="neutral.400" padding={0}>
            <VStack
              ref={containerRef}
              boxShadow="2px 6px 8px rgba(160, 174, 192, 0.6)"
              bg="white"
              rounded="md"
              overflowY="scroll"
              spacing={0}
              maxW="520px"
              maxH="700px"
              p={0}
              onScroll={handleScroll}
            >
              <Flex justifyContent="space-around" w="full" alignItems="center">
                <Text
                  fontSize="md"
                  fontWeight="600"
                  textAlign="start"
                  w="full"
                  p={4}
                  color="textColor"
                >
                  {t('common.notifications')}
                </Text>
                {listNotification.length > 0 && (
                  <Tooltip label={t('common.markAllAsRead')}>
                    <IconButton
                      aria-label="read-all"
                      icon={<RiCheckDoubleFill />}
                      bg="transparent"
                      color="textColor"
                      fontSize="22px"
                      _hover={{
                        bg: 'transparent',
                      }}
                      type="button"
                      onClick={() => unReadCount > 0 && mutate()}
                    />
                  </Tooltip>
                )}
              </Flex>
              <Divider m={0} />
              {listNotification.map((notification, index) => (
                <Box key={index} w="full" onClick={onClose}>
                  <NotificationWidget notification={notification} />
                  {listNotification.length - 1 !== index && <Divider m={0} />}
                </Box>
              ))}
              {listNotification.length <= 0 && (
                <Text fontSize="sm" textAlign="center" w="full" p={4} color="textColor">
                  {isLoading ? 'Loading...' : t('common.noData')}
                </Text>
              )}
            </VStack>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default NotificationsList;
