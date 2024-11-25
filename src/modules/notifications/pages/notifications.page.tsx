import { Fragment, useEffect, useRef } from 'react';

import {
  VStack,
  Divider,
  useColorModeValue,
  Text,
  Flex,
  Button,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RiCheckDoubleFill } from 'react-icons/ri';

import { useMarkReadAllMutation } from '../apis/mark-read-all.api';
import { useMarkReadMutation } from '../apis/mark-read.api';
import { useGetInfiniteNotificationQuery } from '../hooks/queries/use-get-infinite-notifications.hook';
import AssignIssueNotification from '../widgets/assign-issue.widget';
import AssignLeaderNotification from '../widgets/assign-leader.widget';
import AssignMemberNotification from '../widgets/assign-member.widget';
import CreateCommentNotification from '../widgets/create-comment.widget';
import UpdateCommentNotification from '../widgets/update-comment.widget';
import UpdateIssueNotification from '../widgets/update-issue.widget';

import type { INotification } from '../types';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, hasMore, listNotification, fetchMore, isFetching, isRefetching } =
    useGetInfiniteNotificationQuery();

  const { mutate } = useMarkReadAllMutation({});

  const loadMore = () => {
    if (!hasMore || isFetching || isRefetching || isLoading) return;
    fetchMore();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isFetching || isRefetching) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Check if the user has scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadMore();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isRefetching, hasMore]);

  return (
    <VStack
      ref={containerRef}
      boxShadow={useColorModeValue(
        '2px 6px 8px rgba(160, 174, 192, 0.6)',
        '2px 6px 8px rgba(9, 17, 28, 0.9)'
      )}
      bg="white"
      rounded="md"
      overflowY="scroll"
      spacing={0}
      maxW="520px"
      maxH="700px"
      p={0}
    >
      <Flex justifyContent="space-around" w="full" alignItems="center">
        <Text fontSize="md" fontWeight="600" textAlign="start" w="full" p={4} color="textColor">
          {t('common.notifications')}
        </Text>
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
            onClick={() => mutate()}
          />
        </Tooltip>
      </Flex>
      <Divider m={0} />
      {listNotification.map((notification, index) => (
        <Fragment key={index}>
          <NotificationWidget notification={notification} />
          {listNotification.length - 1 !== index && <Divider m={0} />}
        </Fragment>
      ))}
    </VStack>
  );
};

export default NotificationsList;
