import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BadgeIssue } from '../components/badge-issue';
import InlineEditableField from '../components/inline-edit-field';
import InlineEditWithIcon from '../components/inline-edit-field-with-icon';
import { PriorityIssue } from '../components/priority-issue';
import { UserWithAvatar } from '../components/user-with-avatar';
import { useIssuesQueryFilterStateContext } from '../contexts';
import { useUpsertIssueHook } from '../hooks/mutations';
import { useGetListIssueQuery } from '../hooks/queries';
import { ActionMenuTableIssues, ActionTableIssuesWidget } from '../widgets';
import { InlineEditCustomSelect } from '../widgets/editable-dropdown.widget';

import type { IIssue, IUpdatedBy } from '../types';
import type { ColumnsProps } from '@/components/elements';
import type { ILabel } from '@/modules/labels/types';
import type { IPhase } from '@/modules/phases/types';
import type { IStatus } from '@/modules/statuses/types';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { ISSUE_PRIORITY_OPTIONS, ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { formatDate } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { useGetListPhaseQuery } from '@/modules/phases/hooks/queries';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';

export function ListIssuePage() {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const { members, permissions } = useProjectContext();
  const [labels, setLabels] = useState<ILabel[]>([]);
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [phases, setPhases] = useState<IPhase[]>([]);
  const [issueId, setIssueId] = useState('');
  const { issuesQueryState, resetIssuesQueryState } = useIssuesQueryFilterStateContext();

  const canUpdateReporter = () => permissions.includes(ProjectPermissionEnum.IsIssueConfigurator);
  const canUpdate = (assignee?: IUpdatedBy, reporter?: IUpdatedBy) => {
    if (currentUser?.id === assignee?.id || currentUser?.id === reporter?.id) {
      return true;
    }
    return permissions.includes(ProjectPermissionEnum.IsIssueConfigurator);
  };

  const { handleUpsertIssue } = useUpsertIssueHook(undefined, true, issueId);

  const { listIssue, meta, isError, isLoading, handlePaginate, refetch, isRefetching } =
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

  const {
    listPhase,
    isLoading: isLoading5,
    isError: isError5,
  } = useGetListPhaseQuery({
    params: {
      projectId: projectId || '',
    },
  });

  useEffect(() => {
    if (sessionStorage.getItem('refreshIssue') === 'true') {
      refetch().then(() => sessionStorage.setItem('refreshIssue', 'false'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (listLabel && JSON.stringify(listLabel) !== JSON.stringify(labels)) {
      setLabels(listLabel);
    }
  }, [labels, listLabel]);

  useEffect(() => {
    if (listStatus && JSON.stringify(listStatus) !== JSON.stringify(statuses)) {
      setStatuses(listStatus);
    }
  }, [listStatus, statuses]);

  useEffect(() => {
    if (listPhase && JSON.stringify(listPhase) !== JSON.stringify(phases)) {
      setPhases(listPhase);
    }
  }, [listPhase, phases]);

  const handleSubmit = (issue: IIssue, value: string, fieldName?: string) => {
    setIssueId(issue.id);

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
        actualDate: issue.actualDate
          ? (formatDate({
              date: issue.actualDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date)
          : undefined,
        statusId: issue.status.id,
        labelId: issue.label?.id,
        assigneeId: issue.assignee?.id,
        reporterId: issue.reporter?.id,
        phaseId: issue.phase?.id,
        priority: issue.priority,
        ...(fieldName === 'title' && {
          title: value || issue.title,
        }),
        ...(fieldName === 'estimatedTime' && {
          estimatedTime: Number(value) || issue.estimatedTime,
        }),
        ...(fieldName === 'actualTime' && {
          actualTime: Number(value) || issue.actualTime,
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
        ...(fieldName === 'actualDate' && {
          actualDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (issue.actualDate
              ? (formatDate({
                  date: issue.actualDate,
                  format: 'YYYY-MM-DD',
                }) as unknown as Date)
              : undefined),
        }),
        parentIssueId: issue.parentIssue?.id,
      });
    }
  };

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
              return (
                <BadgeIssue content={`#${index}`} variant="solid" colorScheme={status.color} />
              );
            },
          },
          {
            key: 'status',
            title: t('common.status'),
            hasSort: false,
            Cell(issue) {
              const { status, assignee, reporter } = issue;
              return canUpdate(assignee, reporter) ? (
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
              ) : (
                <BadgeIssue content={status.name} colorScheme={status.color} />
              );
            },
          },
          {
            key: 'priority',
            title: t('fields.priority'),
            hasSort: false,
            Cell(issue) {
              const { priority, assignee, reporter } = issue;
              return canUpdate(assignee, reporter) ? (
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
              ) : (
                <PriorityIssue priority={priority} />
              );
            },
          },
          {
            key: 'title',
            title: t('fields.title'),
            hasSort: false,
            Cell(issue) {
              const { assignee, reporter } = issue;
              return (
                <InlineEditWithIcon issue={issue} isViewOnly={!canUpdate(assignee, reporter)} />
              );
            },
          },
          {
            key: 'assigneeId',
            title: t('fields.assignee'),
            hasSort: false,
            Cell(issue) {
              const { assignee, reporter } = issue;
              return canUpdate(assignee, reporter) ? (
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
              ) : (
                <UserWithAvatar
                  image={assignee?.avatar || ''}
                  size2="sm"
                  label={assignee?.userName || ''}
                />
              );
            },
          },
          {
            key: 'reporterId',
            title: t('fields.reporter'),
            hasSort: false,
            Cell(issue) {
              const { reporter } = issue;
              return canUpdateReporter() ? (
                <InlineEditCustomSelect
                  options={members.map((member) => ({
                    label: member.userName,
                    value: member.id,
                    image: member.avatar,
                  }))}
                  defaultValue={
                    reporter && {
                      label: reporter.userName,
                      value: reporter.id,
                      image: reporter.avatar,
                    }
                  }
                  field="reporter"
                  issue={issue}
                />
              ) : (
                <UserWithAvatar
                  image={reporter?.avatar || ''}
                  size2="sm"
                  label={reporter?.userName || ''}
                />
              );
            },
          },
          {
            key: 'parentIssueId',
            title: t('common.parentIssue'),
            hasSort: false,
            Cell({ parentIssue }) {
              return parentIssue ? (
                <CustomLink to={`tasks/${String(parentIssue.id)}`} noOfLines={2}>
                  <BadgeIssue
                    content={`#${parentIssue.index}`}
                    variant="solid"
                    colorScheme={parentIssue.status.color}
                  />
                </CustomLink>
              ) : (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <></>
              );
            },
          },
          {
            key: 'phase',
            title: t('common.phase'),
            hasSort: false,
            Cell(issue) {
              const { phase, assignee, reporter } = issue;
              return canUpdate(assignee, reporter) ? (
                <InlineEditCustomSelect
                  options={phases.map((s) => ({ label: s.title, value: s.id }))}
                  defaultValue={
                    phase && {
                      label: phase.title,
                      value: phase.id,
                    }
                  }
                  field="phase"
                  issue={issue}
                />
              ) : (
                <>{phase?.title}</>
              );
            },
          },
          {
            key: 'label',
            title: t('common.label'),
            hasSort: false,
            Cell(issue) {
              const { label, assignee, reporter } = issue;
              return canUpdate(assignee, reporter) ? (
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
              ) : (
                <>{label?.title}</>
              );
            },
          },
          {
            key: 'percentage',
            title: t('fields.percentageDone'),
            hasSort: false,
            Cell(issue) {
              const { id, percentage } = issue;
              return (
                <InlineEditableField
                  fieldValue={percentage?.toString() || '0'}
                  fieldName="percentage"
                  callback={(val) => handleSubmit(issue, val, 'percentage')}
                  issueId={id}
                  type="progress"
                  minW="136px"
                  isViewOnly={!canUpdate(issue?.assignee, issue?.reporter)}
                />
              );
            },
          },
          {
            key: 'lastUpdateBy',
            title: t('common.lastUpdateBy'),
            hasSort: false,
            Cell({ lastUpdateBy }) {
              return lastUpdateBy ? (
                <UserWithAvatar
                  image={lastUpdateBy.avatar || ''}
                  label={lastUpdateBy.userName || ''}
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
            Cell(issue) {
              const { id, startDate } = issue;
              // return <>{startDate ? formatDate({ date: startDate, format: 'DD-MM-YYYY' }) : ''}</>;
              return (
                <InlineEditableField
                  fieldValue={
                    startDate ? formatDate({ date: startDate, format: 'YYYY-MM-DD' }) || '' : ''
                  }
                  callback={(val) => handleSubmit(issue, val, 'startDate')}
                  fieldName="startDate"
                  issueId={id}
                  type="date"
                  styleProps={{ transform: 'translate(0, -4px)' }}
                  isViewOnly={!canUpdate(issue?.assignee, issue?.reporter)}
                />
              );
            },
          },
          {
            key: 'dueDate',
            title: t('fields.dueDate'),
            hasSort: false,
            Cell(issue) {
              const { id, dueDate } = issue;
              return (
                <InlineEditableField
                  fieldValue={
                    dueDate ? formatDate({ date: dueDate, format: 'YYYY-MM-DD' }) || '' : ''
                  }
                  callback={(val) => handleSubmit(issue, val, 'dueDate')}
                  fieldName="dueDate"
                  issueId={id}
                  type="date"
                  styleProps={{ transform: 'translate(0, -4px)' }}
                  isViewOnly={!canUpdate(issue?.assignee, issue?.reporter)}
                />
              );
            },
          },
          {
            key: 'actualDate',
            title: t('fields.actualDate'),
            hasSort: false,
            Cell(issue) {
              const { id, actualDate } = issue;
              return (
                <InlineEditableField
                  fieldValue={
                    actualDate ? formatDate({ date: actualDate, format: 'YYYY-MM-DD' }) || '' : ''
                  }
                  callback={(val) => handleSubmit(issue, val, 'actualDate')}
                  fieldName="actualDate"
                  issueId={id}
                  type="date"
                  styleProps={{ transform: 'translate(0, -4px)' }}
                  isViewOnly={!canUpdate(issue?.assignee, issue?.reporter)}
                />
              );
            },
          },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, members, statuses, t]
  );

  return (
    <>
      <Head title="Issues" />
      <StateHandler
        showLoader={isLoading || isLoading2 || isLoading3 || isLoading5}
        showError={!!isError || !!isError2 || !!isError3 || !!isError5}
        retryHandler={resetIssuesQueryState}
      >
        <ActionTableIssuesWidget
          listLabel={labels}
          listPhase={phases}
          listStatus={statuses}
          projectId={projectId || ''}
        />
        <TableComponent
          currentPage={meta.pageIndex}
          perPage={meta.pageSize}
          data={listIssue}
          groupColumns={columns}
          totalCount={meta.totalCount}
          isLoading={isLoading || isRefetching}
          isError={!!isError}
          showChangeEntries
          additionalFeature={(issue) => <ActionMenuTableIssues issue={issue} />}
          onPageChange={handlePaginate}
        />
      </StateHandler>
    </>
  );
}
