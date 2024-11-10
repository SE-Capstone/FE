import { useMemo } from 'react';

import { Container, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useGetDetailIssue } from '../../list-issue/apis/detail-issue.api';
import { BadgeIssue, PriorityIssue } from '../../list-issue/components';
import InlineEditableField from '../../list-issue/components/inline-edit-field';
import InlineEditRichtext from '../../list-issue/components/inline-edit-richtext';
import { UserWithAvatar } from '../../list-issue/components/user-with-avatar';
import { useUpsertIssueHook } from '../../list-issue/hooks/mutations';
import { IssuePriorityEnum } from '../../list-issue/types';
import { InlineEditCustomSelect } from '../../list-issue/widgets/editable-dropdown.widget';
import { CommentWidget } from '../widgets/comments.widget';

import { Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { ISSUE_PRIORITY_OPTIONS } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { formatDate } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { InfoCard } from '@/modules/profile/components';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';

export function DetailIssuePage() {
  const { t } = useTranslation();
  const { members } = useProjectContext();
  const { projectId, issueId } = useParams();

  const { issue, isLoading, isError } = useGetDetailIssue({ issueId: issueId || '' });

  const { handleUpsertIssue } = useUpsertIssueHook(undefined, true, issue?.id || '');

  const { listStatus, isLoading: isLoading2 } = useGetListStatusQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const { listLabel, isLoading: isLoading3 } = useGetListLabelQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const handleSubmit = (value: string, fieldName?: string) => {
    if (issue) {
      handleUpsertIssue({
        ...issue,
        startDate: issue.startDate
          ? (formatDate({
              date: issue.startDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date)
          : undefined,
        dueDate: issue.dueDate
          ? (formatDate({
              date: issue.dueDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date)
          : undefined,
        statusId: issue.status.id,
        labelId: issue.label?.id,
        assigneeId: issue.assignee?.id,
        priority: issue.priority,
        ...(fieldName === 'title' && {
          title: value || issue.title,
        }),
        ...(fieldName === 'estimatedTime' && {
          estimatedTime: Number(value) || issue.estimatedTime,
        }),
        ...(fieldName === 'percentage' && {
          percentage: Number(value) || issue.percentage,
        }),
        ...(fieldName === 'startDate' && {
          startDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (issue.startDate
              ? (formatDate({
                  date: issue.startDate,
                  format: 'YYYY-MM-DD',
                }) as unknown as Date)
              : undefined),
        }),
        ...(fieldName === 'dueDate' && {
          dueDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (issue.dueDate
              ? (formatDate({
                  date: issue.dueDate,
                  format: 'YYYY-MM-DD',
                }) as unknown as Date)
              : undefined),
        }),
        // TODO
        // parentIssueId: issue.parentIssueId
      });
    }
  };

  const infoData = useMemo(
    () =>
      [
        {
          label: t('fields.assignee'),
          text: (
            <InlineEditCustomSelect
              options={members.map((member) => ({
                label: member.userName,
                value: member.id,
                image: member.avatar,
              }))}
              defaultValue={
                issue?.assignee && {
                  label: issue?.assignee.userName,
                  value: issue?.assignee.id,
                  image: issue?.assignee.avatar,
                }
              }
              field="assignee"
              issue={issue!}
            />
          ),
        },
        {
          label: t('fields.status'),
          text: (
            <InlineEditCustomSelect
              options={listStatus.map((s) => ({
                label: <BadgeIssue content={s.name} colorScheme={s.color} />,
                value: s.id,
              }))}
              defaultValue={
                issue && {
                  label: (
                    <BadgeIssue content={issue.status.name} colorScheme={issue.status.color} />
                  ),
                  value: issue.status.id,
                }
              }
              field="status"
              issue={issue}
            />
          ),
        },
        {
          label: t('common.label'),
          text: (
            <InlineEditCustomSelect
              options={listLabel.map((s) => ({
                label: s.title,
                value: s.id,
              }))}
              defaultValue={
                issue?.label && {
                  label: issue.label.title,
                  value: issue.label.id,
                }
              }
              field="label"
              issue={issue}
            />
          ),
        },
        {
          label: t('fields.priority'),
          text: (
            <InlineEditCustomSelect
              options={ISSUE_PRIORITY_OPTIONS.map((value) => ({
                label: <PriorityIssue priority={value} />,
                value,
              }))}
              defaultValue={{
                label: <PriorityIssue priority={issue?.priority || IssuePriorityEnum.Medium} />,
                value: IssuePriorityEnum.Medium,
              }}
              field="priority"
              issue={issue!}
            />
          ),
        },
        {
          label: t('fields.percentageDone'),
          text: (
            <InlineEditableField
              fieldValue={issue?.percentage?.toString() || '0'}
              callback={handleSubmit}
              fieldName="percentage"
              type="progress"
            />
          ),
        },
        {
          label: t('fields.estimatedTime'),
          text: (
            <InlineEditableField
              fieldValue={issue?.estimatedTime?.toString() || ''}
              callback={handleSubmit}
              fieldName="estimatedTime"
              styleProps={{ minW: '200px', minH: '20px' }}
            />
          ),
        },
        {
          label: t('fields.startDate'),
          text: (
            <InlineEditableField
              fieldValue={
                issue?.startDate
                  ? formatDate({ date: issue?.startDate, format: 'YYYY-MM-DD' }) || ''
                  : ''
              }
              callback={handleSubmit}
              fieldName="startDate"
              type="date"
              styleProps={{ transform: 'translate(0, -4px)' }}
            />
          ),
        },
        {
          label: t('fields.dueDate'),
          text: (
            <InlineEditableField
              fieldValue={
                issue?.dueDate
                  ? formatDate({ date: issue?.dueDate, format: 'YYYY-MM-DD' }) || ''
                  : ''
              }
              callback={handleSubmit}
              fieldName="dueDate"
              type="date"
              styleProps={{ transform: 'translate(0, -4px)' }}
            />
          ),
        },
        issue?.lastUpdatedBy && {
          label: t('common.lastUpdatedBy'),
          text: issue.lastUpdatedBy && (
            <UserWithAvatar
              image={issue.lastUpdatedBy.avatar || ''}
              label={issue.lastUpdatedBy.userName || ''}
            />
          ),
        },
        {
          label: t('fields.reporter'),
          text: (
            <UserWithAvatar
              image={issue?.reporter?.avatar || ''}
              label={issue?.reporter?.userName || ''}
            />
          ),
        },
        // TODO: Add phase field
      ].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [issue, listStatus, members, t]
  );

  return (
    <>
      <Head title={issue?.title} />
      <Container maxW="container.2xl" centerContent>
        <StateHandler showLoader={isLoading || isLoading2 || isLoading3} showError={!!isError}>
          <LayoutBack
            display="flex"
            flexDir="row"
            bgColor="transparent"
            justify="space-between"
            alignItems="center"
            py="14px"
            px={0}
            pb={0}
            title={issue?.title}
          >
            {/* <Button as={Link} to="edit">
              {t('actions.edit')}
            </Button> */}
            {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
            <></>
          </LayoutBack>

          <Stack
            direction={{ base: 'column', xl: 'row' }}
            alignItems="stretch"
            spacing="24px"
            w="100%"
            mt={5}
          >
            <Stack w="full" spacing="24px" flex={2.8}>
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
                  <InlineEditableField
                    fieldValue={issue?.title || ''}
                    callback={handleSubmit}
                    type="title"
                  />
                </Text>
                <InlineEditRichtext issue={issue!} />
                <Stack />
              </Stack>

              <Stack w="full" spacing="24px">
                <Stack borderRadius="8px" direction="column" spacing="24px">
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
                    {t('common.comments')}
                  </Text>
                  <CommentWidget />
                  <Stack />
                </Stack>
              </Stack>
            </Stack>
            <Stack
              bg="white"
              p={5}
              flex={1}
              flexBasis="10%"
              rounded={2.5}
              spacing={3}
              height="fit-content"
            >
              <Stack
                display="flex"
                alignItems="center"
                w="full"
                flexDir="row"
                sx={{
                  fontWeight: 'semibold',
                  fontSize: '20px',
                  lineHeight: '27px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid',
                  borderColor: 'neutral.500',
                }}
              >
                <Text
                  flex={1}
                  w="full"
                  sx={{
                    fontWeight: 'semibold',
                    fontSize: '20px',
                    lineHeight: '27px',
                  }}
                  display="flex"
                  alignItems="center"
                >
                  {t('fields.details')}
                </Text>
                <Stack />
              </Stack>
              <InfoCard
                data={infoData}
                labelProps={{
                  sx: {
                    w: '150px',
                  },
                }}
                stackProps={{ alignItems: 'center' }}
              />
            </Stack>
          </Stack>
        </StateHandler>
      </Container>
    </>
  );
}
