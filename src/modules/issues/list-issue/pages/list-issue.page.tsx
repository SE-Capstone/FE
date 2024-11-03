import { useMemo } from 'react';

import { Progress } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BadgeIssue } from '../components/badge-issue';
import { PriorityIssue } from '../components/priority-issue';
import { useIssuesQueryFilterStateContext } from '../contexts';
import { useGetListIssueQuery } from '../hooks/queries';
import { ActionMenuTableIssues, ActionTableIssuesWidget } from '../widgets';
import { InlineEditCustomSelect } from '../widgets/editable-dropdown.widget';

import type { IIssue } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { formatDate } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';

export function ListIssuePage() {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { issuesQueryState, resetIssuesQueryState } = useIssuesQueryFilterStateContext();

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

  const {
    listStatus,
    isError: isError3,
    isLoading: isLoading3,
  } = useGetListStatusQuery({
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
              return <BadgeIssue content={index} variant="solid" colorScheme={status.color} />;
            },
          },
          {
            key: 'status',
            title: t('common.status'),
            hasSort: false,
            Cell(issue) {
              const { status } = issue;
              return (
                <InlineEditCustomSelect
                  options={listStatus.map((s) => ({ label: s.name, value: s.id }))}
                  defaultValue={{
                    label: status.name,
                    value: status.id,
                  }}
                  field="status"
                  issue={issue}
                />
              );
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
                <CustomLink to={String(id)} noOfLines={1}>
                  {title}
                </CustomLink>
              );
            },
          },
          {
            key: 'assigneeId',
            title: t('fields.assignee'),
            hasSort: false,
            Cell({ assignee }) {
              return <>{assignee?.userName || ''}</>;
            },
          },
          {
            key: 'label',
            title: t('common.label'),
            hasSort: false,
            Cell({ label }) {
              return <>{label?.title}</>;
            },
          },
          {
            key: 'percentage',
            title: t('fields.percentageDone'),
            hasSort: false,
            Cell({ percentage }) {
              return <Progress rounded={1.5} colorScheme="green" value={percentage || 0} />;
            },
          },
          {
            key: 'lastUpdatedBy',
            title: t('common.lastUpdatedBy'),
            hasSort: false,
            Cell({ lastUpdatedBy }) {
              return <>{lastUpdatedBy?.userName || ''}</>;
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
        ],
      },
    ],
    [listStatus, t]
  );

  return (
    <>
      <Head title="Issues" />
      <StateHandler
        showLoader={isLoading || isLoading2 || isLoading3}
        showError={!!isError || !!isError2 || !!isError3}
        retryHandler={resetIssuesQueryState}
      >
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
      </StateHandler>
    </>
  );
}
