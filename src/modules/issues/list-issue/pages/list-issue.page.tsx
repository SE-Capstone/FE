import { useMemo } from 'react';

import { Container, Progress } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { BadgeIssue } from '../components/badge-issue';
import { PriorityIssue } from '../components/priority-issue';
import { useIssuesQueryFilterStateContext } from '../contexts';
import { useGetListIssueQuery } from '../hooks/queries';
import { ActionMenuTableIssues, ActionTableIssuesWidget } from '../widgets';

import type { IIssue } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { formatDate } from '@/libs/helpers';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListIssuePage() {
  const { issuesQueryState, resetIssuesQueryState } = useIssuesQueryFilterStateContext();
  const { pathname } = useLocation();

  const { listIssue, meta, isError, isLoading, handlePaginate, isRefetching } =
    useGetListIssueQuery({
      params: issuesQueryState.filters,
    });

  const columns = useMemo<ColumnsProps<IIssue>>(
    () => [
      {
        header: 'Issue',
        columns: [
          {
            key: 'id',
            hasSort: false,
            title: '#',
            tableCellProps: { w: 4, pr: 2 },
            Cell({ id, statusColor }) {
              return <BadgeIssue content={id} colorScheme={statusColor} />;
            },
          },
          {
            key: 'label',
            title: 'Label',
            hasSort: false,
            Cell({ labelName }) {
              return <>{labelName}</>;
            },
          },
          {
            key: 'status',
            title: 'Status',
            hasSort: false,
            Cell({ statusName }) {
              return <>{statusName}</>;
            },
          },
          {
            key: 'priority',
            title: 'Priority',
            hasSort: false,
            Cell({ priority }) {
              return <PriorityIssue priority={priority} />;
            },
          },
          {
            key: 'subject',
            title: 'Subject',
            hasSort: false,
            Cell({ subject, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listIssue) ? String(id) : '#'}
                  noOfLines={1}
                >
                  {subject}
                </CustomLink>
              );
            },
          },
          {
            key: 'assigneeId',
            title: 'Assignee',
            hasSort: false,
            Cell({ assigneeName }) {
              return <>{assigneeName || ''}</>;
            },
          },
          {
            key: 'percentage',
            title: '$ Done',
            hasSort: false,
            Cell({ percentage }) {
              return <Progress value={percentage} />;
            },
          },
          {
            key: 'lastUpdatedBy',
            title: 'Last updated by',
            hasSort: false,
            Cell({ lastUpdatedBy }) {
              return <>{lastUpdatedBy || ''}</>;
            },
          },
          {
            key: 'startDate',
            title: 'Start date',
            hasSort: false,
            Cell({ startDate }) {
              return <>{formatDate({ date: startDate, format: 'DD-MM-YYYY' }) || ''}</>;
            },
          },
          {
            key: 'dueDate',
            title: 'Due date',
            hasSort: false,
            Cell({ dueDate }) {
              return <>{formatDate({ date: dueDate, format: 'DD-MM-YYYY' }) || ''}</>;
            },
          },
          {
            key: 'updatedAt',
            title: 'Updated at',
            hasSort: false,
            Cell({ updatedAt, createdAt }) {
              return (
                <>{formatDate({ date: updatedAt || createdAt, format: 'DD-MM-YYYY: HH:mm' })}</>
              );
            },
          },
        ],
      },
    ],
    [pathname]
  );

  return (
    <>
      <Head title="Issues" />
      <Container maxW="container.2xl" centerContent>
        <StateHandler
          showLoader={isLoading}
          showError={!!isError}
          retryHandler={resetIssuesQueryState}
        >
          <Container maxW="container.2xl" centerContent>
            <ActionTableIssuesWidget />
            <TableComponent
              currentPage={meta.pageIndex}
              perPage={meta.pageSize}
              data={listIssue}
              groupColumns={columns}
              totalCount={meta.totalCount}
              isLoading={isLoading || isRefetching}
              isError={!!isError}
              additionalFeature={(issue) => <ActionMenuTableIssues issue={issue} />}
              onPageChange={handlePaginate}
            />
          </Container>
        </StateHandler>
      </Container>
    </>
  );
}
