import { useMemo } from 'react';

import IssuesIcon from '@atlaskit/icon/glyph/issues';
import SubtaskIcon from '@atlaskit/icon/glyph/subtask';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdOutlineChevronRight } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { useGetDetailIssue } from '../../list-issue/apis/detail-issue.api';
import { BadgeIssue, PriorityIssue } from '../../list-issue/components';
import InlineEditableField from '../../list-issue/components/inline-edit-field';
import InlineEditWithIcon from '../../list-issue/components/inline-edit-field-with-icon';
import InlineEditRichtext from '../../list-issue/components/inline-edit-richtext';
import { UserWithAvatar } from '../../list-issue/components/user-with-avatar';
import { useUpsertIssueHook } from '../../list-issue/hooks/mutations';
import { IssuePriorityEnum, type IUpdatedBy } from '../../list-issue/types';
import { AddNewIssueWidget } from '../../list-issue/widgets';
import { InlineEditCustomSelect } from '../../list-issue/widgets/editable-dropdown.widget';
import { CommentWidget } from '../widgets/comments.widget';

import { CustomLink, Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { ISSUE_PRIORITY_OPTIONS, ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { formatDate } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { useGetListPhaseQuery } from '@/modules/phases/hooks/queries';
import { InfoCard } from '@/modules/profile/components';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function DetailIssuePage() {
  const { t } = useTranslation();
  const { members, permissions } = useProjectContext();
  const { currentUser } = useAuthentication();
  const { projectId, issueId } = useParams();

  const { issue, isLoading, isError } = useGetDetailIssue({ issueId: issueId || '' });

  const { handleUpsertIssue } = useUpsertIssueHook(undefined, true, issue?.id || '');

  const canUpdate = (assignee?: IUpdatedBy) => {
    if (currentUser?.id === assignee?.id) {
      return true;
    }
    return permissions.includes(ProjectPermissionEnum.IsIssueConfigurator);
  };
  const canUpdateComment = (assignee?: IUpdatedBy) => {
    if (currentUser?.id === assignee?.id) {
      return true;
    }
    return permissions.includes(ProjectPermissionEnum.IsCommentConfigurator);
  };

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

  const { listPhase, isLoading: isLoading5 } = useGetListPhaseQuery({
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
        phaseId: issue.phase?.id,
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
        parentIssueId: issue.parentIssue?.id,
      });
    }
  };

  const infoData = useMemo(
    () =>
      [
        {
          label: t('fields.assignee'),
          text: canUpdate(issue?.assignee) ? (
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
          ) : (
            <UserWithAvatar
              image={issue?.assignee?.avatar || ''}
              size2="sm"
              label={issue?.assignee?.userName || ''}
            />
          ),
        },
        {
          label: t('fields.status'),
          text: canUpdate(issue?.assignee) ? (
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
          ) : (
            <BadgeIssue content={issue?.status.name} colorScheme={issue?.status.color} />
          ),
        },
        {
          label: t('fields.priority'),
          text: canUpdate(issue?.assignee) ? (
            <InlineEditCustomSelect
              options={ISSUE_PRIORITY_OPTIONS.map((value) => ({
                label: <PriorityIssue priority={value} />,
                value,
              }))}
              defaultValue={
                issue?.priority && {
                  label: <PriorityIssue priority={issue.priority} />,
                  value: issue.priority,
                }
              }
              field="priority"
              issue={issue!}
            />
          ) : (
            <PriorityIssue priority={issue?.priority || IssuePriorityEnum.Medium} />
          ),
        },
        {
          label: t('common.phase'),
          text: canUpdate(issue?.assignee) ? (
            <InlineEditCustomSelect
              options={listPhase.map((p) => ({
                label: p.title,
                value: p.id,
              }))}
              defaultValue={
                issue?.phase && {
                  label: issue.phase.title,
                  value: issue.phase.id,
                }
              }
              field="phase"
              issue={issue!}
            />
          ) : (
            <PriorityIssue priority={issue?.priority || IssuePriorityEnum.Medium} />
          ),
        },
        {
          label: t('common.label'),
          text: canUpdate(issue?.assignee) ? (
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
          ) : (
            <>{issue?.label?.title}</>
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
              isViewOnly={!canUpdate(issue?.assignee)}
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
              isViewOnly={!canUpdate(issue?.assignee)}
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
              isViewOnly={!canUpdate(issue?.assignee)}
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
              isViewOnly={!canUpdate(issue?.assignee)}
            />
          ),
        },
        issue?.lastUpdateBy && {
          label: t('common.lastUpdateBy'),
          text: issue.lastUpdateBy && (
            <UserWithAvatar
              image={issue.lastUpdateBy.avatar || ''}
              label={issue.lastUpdateBy.userName || ''}
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
        <StateHandler
          showLoader={isLoading || isLoading2 || isLoading3 || isLoading5}
          showError={!!isError}
        >
          <Breadcrumb
            textAlign="start"
            spacing="8px"
            w="full"
            separator={<MdOutlineChevronRight color="neutral.300" />}
          >
            <BreadcrumbItem>
              <CustomLink color="neutral.300" to={APP_PATHS.detailProject(projectId || '')}>
                {t('common.project')}
              </CustomLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              {issue?.parentIssueId ? (
                <CustomLink
                  color="neutral.300"
                  to={APP_PATHS.detailIssue(projectId || '', issue?.parentIssueId || '')}
                >
                  #{issue?.parentIssue && issue?.parentIssue.index}
                </CustomLink>
              ) : (
                <Text fontSize="16px" color="neutral.300">
                  #{issue?.index}
                </Text>
              )}
            </BreadcrumbItem>

            {issue?.parentIssueId && (
              <BreadcrumbItem>
                <Text fontSize="16px" color="neutral.300">
                  #{issue?.index}
                </Text>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
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
                    isViewOnly={!canUpdate(issue?.assignee)}
                  />
                </Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    w="fit-content"
                    aria-label="Options"
                    leftIcon={<>+</>}
                    variant="solid"
                    bg="primary"
                  >
                    {t('common.add')}
                  </MenuButton>

                  <MenuList borderColor="#E2E8F0">
                    {!issue?.parentIssueId && (
                      <AddNewIssueWidget parentIssueId={issue?.id || ''}>
                        <MenuItem>
                          <SubtaskIcon label="Subtask" />
                          <Text ml={2}>{t('common.subTask')}</Text>
                        </MenuItem>
                      </AddNewIssueWidget>
                    )}
                    <MenuItem>
                      <IssuesIcon label="LinkedIssue" />
                      <Text ml={2}>{t('common.linkedIssue')}</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <InlineEditRichtext issue={issue!} isEditable={canUpdate(issue?.assignee)} />

                {!issue?.parentIssueId && issue?.subIssues && issue?.subIssues.length > 0 && (
                  <Stack gap={0}>
                    <Stack
                      display="flex"
                      flexDir="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text fontSize="lg" fontWeight="600">
                        {t('common.subTasks')}
                      </Text>
                      <AddNewIssueWidget parentIssueId={issue?.id || ''}>
                        <Button
                          bg="transparent"
                          color="#464649"
                          _hover={{
                            bg: '#F4F4F9',
                          }}
                          fontSize="md"
                        >
                          +
                        </Button>
                      </AddNewIssueWidget>
                    </Stack>
                    <Stack
                      borderRadius="3px"
                      boxShadow="0px 1px 1px #091E4240, 0px 0px 1px #091E424F"
                      gap={0}
                      mt={2}
                    >
                      {issue.subIssues.map((i, index) => (
                        <Box
                          key={index}
                          padding={2}
                          borderBottom={issue.subIssues?.length !== index ? '1px solid #ccc' : ''}
                        >
                          <Flex alignItems="center" justifyContent="space-between" gap={2}>
                            <Flex alignItems="center" gap={2} flex={1}>
                              <BadgeIssue
                                content={`#${i.index}`}
                                variant="solid"
                                colorScheme={i.status?.color || 'gray'}
                              />
                              <InlineEditWithIcon
                                issue={i}
                                boxStyle={{
                                  marginTop: canUpdate(i.assignee) ? '-4px' : '0',
                                }}
                                buttonStyle={{
                                  maxHeight: 'fit-content',
                                }}
                                link={APP_PATHS.detailIssue(projectId || '', i.id)}
                                isViewOnly={!canUpdate(i.assignee)}
                              />
                            </Flex>
                            <Flex alignItems="center" gap={2}>
                              {canUpdate(issue?.assignee) ? (
                                <InlineEditCustomSelect
                                  options={ISSUE_PRIORITY_OPTIONS.map((value) => ({
                                    label: <PriorityIssue priority={value} />,
                                    value,
                                  }))}
                                  defaultValue={
                                    i?.priority && {
                                      label: <PriorityIssue priority={i.priority} hideText />,
                                      value: i.priority,
                                    }
                                  }
                                  size="sm"
                                  field="priority"
                                  issue={i}
                                />
                              ) : (
                                <PriorityIssue priority={i.priority} hideText />
                              )}
                              {canUpdate(issue?.assignee) ? (
                                <InlineEditCustomSelect
                                  size="sm"
                                  options={members.map((member) => ({
                                    label: member.userName,
                                    value: member.id,
                                    image: member.avatar,
                                  }))}
                                  defaultValue={
                                    i.assignee
                                      ? {
                                          label: i?.assignee.userName,
                                          value: i?.assignee.id,
                                          image: i?.assignee.avatar,
                                        }
                                      : {
                                          label: '',
                                          value: '',
                                          image:
                                            'https://i.pinimg.com/1200x/bc/43/98/bc439871417621836a0eeea768d60944.jpg',
                                        }
                                  }
                                  field="assignee"
                                  issue={i}
                                />
                              ) : (
                                <UserWithAvatar
                                  image={i?.assignee?.avatar || ''}
                                  label={i?.assignee?.userName || ''}
                                  hideText
                                />
                              )}
                              {canUpdate(issue?.assignee) ? (
                                <InlineEditCustomSelect
                                  options={listStatus.map((s) => ({
                                    label: <BadgeIssue content={s.name} colorScheme={s.color} />,
                                    value: s.id,
                                  }))}
                                  size="sm"
                                  defaultValue={
                                    i && {
                                      label: (
                                        <BadgeIssue
                                          content={i.status?.name}
                                          colorScheme={i.status?.color || 'gray'}
                                        />
                                      ),
                                      value: i.status?.id,
                                    }
                                  }
                                  field="status"
                                  issue={i}
                                />
                              ) : (
                                <BadgeIssue
                                  content={i.status?.name}
                                  colorScheme={i.status?.color || 'gray'}
                                />
                              )}
                            </Flex>
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                )}
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
                  <CommentWidget index={0} isComment={false} />
                  {issue?.comments?.map((comment, index) => (
                    <CommentWidget
                      key={comment.id}
                      comment={comment}
                      index={index + 1}
                      isEditable={canUpdateComment(comment.user as any)}
                    />
                  ))}
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
