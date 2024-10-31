import { useMemo } from 'react';

import { Container, Progress } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

import { BadgeIssue } from '../components/badge-issue';
import { PriorityIssue } from '../components/priority-issue';
import { useIssuesQueryFilterStateContext } from '../contexts';
import { useGetListIssueQuery } from '../hooks/queries';
import { ActionMenuTableIssues, ActionTableIssuesWidget } from '../widgets';

import type { IIssue } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { formatDate } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListIssuePage() {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { issuesQueryState, resetIssuesQueryState } = useIssuesQueryFilterStateContext();
  const { pathname } = useLocation();

  const { listIssue, meta, isError, isLoading, handlePaginate, isRefetching } =
    useGetListIssueQuery({
      params: issuesQueryState.filters,
      projectId: projectId || '',
    });

  const {
    listLabel,
    isError: isError2,
    isLoading: isLoading2,
  } = useGetListLabelQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const columns = useMemo<ColumnsProps<IIssue>>(
    () => [
      {
        header: 'Issue',
        columns: [
          {
            key: 'index',
            hasSort: false,
            title: '#',
            tableCellProps: { w: 4, pr: 2 },
            Cell({ index, status }) {
              return <BadgeIssue content={index} colorScheme={status.color} />;
            },
          },
          {
            key: 'label',
            title: t('common.label'),
            hasSort: false,
            Cell({ label }) {
              return <>{label}</>;
            },
          },
          {
            key: 'status',
            title: t('common.status'),
            hasSort: false,
            Cell({ status }) {
              return <>{status.name}</>;
            },
          },
          {
            key: 'priority',
            title: t('fields.priority'),
            hasSort: false,
            Cell({ priority }) {
              return <PriorityIssue priority={priority} />;
            },
          },
          {
            key: 'title',
            title: t('fields.title'),
            hasSort: false,
            Cell({ title, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listIssue) ? String(id) : '#'}
                  noOfLines={1}
                >
                  {title}
                </CustomLink>
              );
            },
          },
          {
            key: 'assigneeId',
            title: t('fields.assignee'),
            hasSort: false,
            Cell({ assigneeName }) {
              return <>{assigneeName || ''}</>;
            },
          },
          {
            key: 'percentage',
            title: t('fields.percentageDone'),
            hasSort: false,
            Cell({ percentage }) {
              return <Progress rounded={1.5} value={percentage} />;
            },
          },
          {
            key: 'lastUpdatedBy',
            title: t('common.lastUpdatedBy'),
            hasSort: false,
            Cell({ lastUpdatedBy }) {
              return <>{lastUpdatedBy || ''}</>;
            },
          },
          {
            key: 'startDate',
            title: t('fields.startDate'),
            hasSort: false,
            Cell({ startDate }) {
              return <>{startDate ? formatDate({ date: startDate, format: 'DD-MM-YYYY' }) : ''}</>;
            },
          },
          {
            key: 'dueDate',
            title: t('fields.dueDate'),
            hasSort: false,
            Cell({ dueDate }) {
              return <>{dueDate ? formatDate({ date: dueDate, format: 'DD-MM-YYYY' }) : ''}</>;
            },
          },
          {
            key: 'updatedAt',
            title: t('fields.updatedAt'),
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
    [pathname, t]
  );

  return (
    <>
      <Head title="Issues" />
      <Container maxW="container.2xl" centerContent>
        <StateHandler
          showLoader={isLoading || isLoading2}
          showError={!!isError || !!isError2}
          retryHandler={resetIssuesQueryState}
        >
          <Container maxW="container.2xl" centerContent>
            <ActionTableIssuesWidget listLabel={listLabel} />
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
