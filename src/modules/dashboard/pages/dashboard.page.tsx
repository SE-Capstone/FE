import { useMemo, useState } from 'react';

import { GridItem, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import Chart from 'chart.js/auto';
import { useTranslation } from 'react-i18next';

import { useGetMyTasks } from '../apis/get-my-task.api';
import StatsWithIcons from '../widgets/card-stat.widget';
import { ReportProjectsByStatusWidget } from '../widgets/report-project-by-status.widget';
import { ReportSkillsWidget } from '../widgets/report-skills.widget';

import type { IIssueDash } from '../widgets/card-stat.widget';
import type { ColumnsProps } from '@/components/elements';

import {
  CustomChakraReactSelect,
  CustomLink,
  StateHandler,
  TableComponent,
} from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { formatDate } from '@/libs/helpers';
import { BadgeIssue } from '@/modules/issues/list-issue/components';
import InlineEditableField from '@/modules/issues/list-issue/components/inline-edit-field';
import { UserWithAvatar } from '@/modules/issues/list-issue/components/user-with-avatar';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

Chart.register();

export function DashboardPage() {
  const { t } = useTranslation();
  const [isDone, setIsDone] = useState<boolean | undefined>(undefined);
  const { permissions, currentUser } = useAuthentication();
  const { myTasks, meta, isError, isLoading, handlePaginate, isRefetching } = useGetMyTasks({
    params: {
      userId: currentUser?.id || '',
      isTaskDone: isDone,
    },
  });

  const columns = useMemo<ColumnsProps<IIssueDash>>(
    () => [
      {
        header: 'Issue',
        columns: [
          {
            key: 'index',
            hasSort: false,
            title: '#',
            tableCellProps: { w: 4, pr: 2 },
            Cell({ index, color }) {
              return <BadgeIssue content={`#${index}`} variant="solid" colorScheme={color} />;
            },
          },
          {
            key: 'projectName',
            title: `${t('fields.title')} ${t('common.project')}`,
            hasSort: false,
            Cell({ projectName, projectId }) {
              return (
                <CustomLink
                  to={APP_PATHS.detailProject(projectId)}
                  noOfLines={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  {projectName || ''}
                </CustomLink>
              );
            },
          },
          {
            key: 'status',
            title: t('common.status'),
            hasSort: false,
            Cell({ statusName, color }) {
              return <BadgeIssue content={statusName} colorScheme={color} />;
            },
          },
          {
            key: 'title',
            title: `${t('fields.title')} ${t('common.issue')}`,
            hasSort: false,
            Cell({ projectId, taskId, taskName }) {
              return (
                <CustomLink
                  to={APP_PATHS.detailIssue(projectId, taskId)}
                  noOfLines={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  {taskName || ''}
                </CustomLink>
              );
            },
          },
          {
            key: 'assignee',
            title: `${t('fields.assignee')}`,
            hasSort: false,
            Cell({ userName, avatar }) {
              return <UserWithAvatar image={avatar || ''} size2="sm" label={userName || ''} />;
            },
          },
          {
            key: 'startDate',
            title: t('fields.startDate'),
            hasSort: false,
            Cell({ startDate }) {
              return (
                <InlineEditableField
                  fieldValue={
                    startDate ? formatDate({ date: startDate, format: 'YYYY-MM-DD' }) || '' : ''
                  }
                  callback={() => {}}
                  fieldName="startDate"
                  issueId=""
                  type="date"
                  isViewOnly
                />
              );
            },
          },
          {
            key: 'dueDate',
            title: t('fields.dueDate'),
            hasSort: false,
            Cell({ dueDate }) {
              return (
                <InlineEditableField
                  fieldValue={
                    dueDate ? formatDate({ date: dueDate, format: 'YYYY-MM-DD' }) || '' : ''
                  }
                  callback={() => {}}
                  fieldName="dueDate"
                  issueId=""
                  type="date"
                  isViewOnly
                />
              );
            },
          },
          {
            key: 'actualDate',
            title: t('fields.actualDate'),
            hasSort: false,
            Cell({ actualDate }) {
              return (
                <InlineEditableField
                  fieldValue={
                    actualDate ? formatDate({ date: actualDate, format: 'YYYY-MM-DD' }) || '' : ''
                  }
                  callback={() => {}}
                  fieldName="actualDate"
                  issueId=""
                  type="date"
                  isViewOnly
                />
              );
            },
          },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [myTasks, t]
  );

  return (
    <>
      <StatsWithIcons />
      {/* <Grid
        alignItems="center"
        gap={2}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        <GridItem colSpan={1} maxHeight="500px">
          <ReportProjectsByStatusWidget />
        </GridItem>
        <GridItem colSpan={2}>
          <ReportSkillsWidget />
        </GridItem>
      </Grid> */}
      {permissions[PermissionEnum.VIEW_DASHBOARD] && (
        <SimpleGrid
          columns={{ base: 1, sm: permissions[PermissionEnum.VIEW_DASHBOARD] ? 3 : 4 }}
          spacing={5}
        >
          <GridItem colSpan={1} maxHeight="500px">
            <ReportProjectsByStatusWidget />
          </GridItem>
          <GridItem colSpan={{ base: 1, sm: 2 }}>
            <ReportSkillsWidget />
          </GridItem>
        </SimpleGrid>
      )}
      <Stack my={2} />
      <Text my={3} fontSize="20px" fontWeight="600">
        {t('common.myTasks')}
      </Text>
      <StateHandler showLoader={isLoading} showError={!!isError}>
        <SimpleGrid mb={3} columns={3} spacing={5}>
          <GridItem colSpan={1} maxHeight="500px">
            <CustomChakraReactSelect
              isSearchable={false}
              size="sm"
              placeholder={`${t('common.filterDone')}`}
              options={[
                {
                  label: t('common.done2'),
                  value: 'true',
                },
                {
                  label: t('common.notDone'),
                  value: 'false',
                },
              ]}
              onChange={(opt) => {
                opt?.value
                  ? opt.value === 'true'
                    ? setIsDone(true)
                    : setIsDone(false)
                  : undefined;
              }}
            />
          </GridItem>
        </SimpleGrid>

        <TableComponent
          currentPage={meta.pageIndex}
          perPage={meta.pageSize}
          data={myTasks}
          groupColumns={columns}
          totalCount={meta.totalCount}
          isLoading={isLoading || isRefetching}
          isError={!!isError}
          showChangeEntries
          onPageChange={handlePaginate}
        />
      </StateHandler>
    </>
  );
}
