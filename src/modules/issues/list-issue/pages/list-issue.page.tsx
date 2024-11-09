import { useEffect, useMemo, useState } from 'react';

import { Progress } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BadgeIssue } from '../components/badge-issue';
import InlineEditWithIcon from '../components/inline-edit-field-with-icon';
import { PriorityIssue } from '../components/priority-issue';
import { UserWithAvatar } from '../components/user-with-avatar';
import { useIssuesQueryFilterStateContext } from '../contexts';
import { useGetListIssueQuery } from '../hooks/queries';
import { ActionMenuTableIssues, ActionTableIssuesWidget } from '../widgets';
import { InlineEditCustomSelect } from '../widgets/editable-dropdown.widget';

import type { IIssue } from '../types';
import type { ColumnsProps } from '@/components/elements';
import type { ILabel } from '@/modules/labels/types';
import type { IStatus } from '@/modules/statuses/types';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { ISSUE_PRIORITY_OPTIONS } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { formatDate } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';

export function ListIssuePage() {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { members } = useProjectContext();
  const [labels, setLabels] = useState<ILabel[]>([]);
  const [statuses, setStatuses] = useState<IStatus[]>([]);
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

  useEffect(() => {
    if (listLabel && JSON.stringify(listLabel) !== JSON.stringify(labels)) {
      setLabels(listLabel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listLabel]);

  useEffect(() => {
    if (listStatus && JSON.stringify(listStatus) !== JSON.stringify(statuses)) {
      setStatuses(listStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listStatus]);

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
                  options={statuses.map((s) => ({
                    label: <BadgeIssue content={s.name} colorScheme={s.color} />,
                    value: s.id,
                  }))}
                  defaultValue={{
                    label: <BadgeIssue content={status.name} colorScheme={status.color} />,
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
            Cell(issue) {
              const { priority } = issue;
              return (
                <InlineEditCustomSelect
                  options={ISSUE_PRIORITY_OPTIONS.map((value) => ({
                    label: <PriorityIssue priority={value} />,
                    value,
                  }))}
                  defaultValue={{
                    label: <PriorityIssue priority={priority} />,
                    value: priority,
                  }}
                  field="priority"
                  issue={issue}
                />
              );
            },
          },
          {
            key: 'title',
            title: t('fields.title'),
            hasSort: false,
            Cell(issue) {
              return <InlineEditWithIcon issue={issue} />;
            },
          },
          {
            key: 'assigneeId',
            title: t('fields.assignee'),
            hasSort: false,
            Cell(issue) {
              const { assignee } = issue;
              return (
                <InlineEditCustomSelect
                  options={members.map((member) => ({
                    label: member.userName,
                    value: member.id,
                    image: member.avatar,
                  }))}
                  defaultValue={
                    assignee && {
                      label: assignee.userName,
                      value: assignee.id,
                      image: assignee.avatar,
                    }
                  }
                  field="assignee"
                  issue={issue}
                />
              );
            },
          },
          {
            key: 'reporterId',
            title: t('fields.reporter'),
            hasSort: false,
            Cell({ reporter }) {
              return (
                <UserWithAvatar image={reporter?.avatar || ''} label={reporter?.userName || ''} />
              );
            },
          },
          {
            key: 'label',
            title: t('common.label'),
            hasSort: false,
            Cell(issue) {
              const { label } = issue;
              return (
                <InlineEditCustomSelect
                  options={labels.map((s) => ({ label: s.title, value: s.id }))}
                  defaultValue={
                    label && {
                      label: label.title,
                      value: label.id,
                    }
                  }
                  field="label"
                  issue={issue}
                />
              );
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
              return lastUpdatedBy ? (
                <UserWithAvatar
                  image={lastUpdatedBy.avatar || ''}
                  label={lastUpdatedBy.userName || ''}
                />
              ) : (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <></>
              );
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
    [labels, members, statuses, t]
  );

  return (
    <>
      <Head title="Issues" />
      <StateHandler
        showLoader={isLoading || isLoading2 || isLoading3}
        showError={!!isError || !!isError2 || !!isError3}
        retryHandler={resetIssuesQueryState}
      >
        <ActionTableIssuesWidget listLabel={labels} />
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
