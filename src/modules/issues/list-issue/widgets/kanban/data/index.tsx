import { useParams } from 'react-router-dom';

import { useGetKanbanQuery } from '../../../hooks/queries/use-get-kanban.hook';

import type { IIssue } from '../../../types';
import type { ThemingProps } from '@chakra-ui/react';

import { formatDate, isDateLessThanToday } from '@/libs/helpers';

export type Issue = {
  id: string;
  title: string;
  index: string;
  statusId: string;
  dueDate?: string;
  issue: IIssue;
  isLate: boolean;
  isDone: boolean;
  statusColor: ThemingProps['colorScheme'];
};

function getIssue(
  issue: IIssue,
  color: ThemingProps['colorScheme'],
  statusId: string,
  isDone: boolean
): Issue {
  return {
    issue,
    statusId,
    id: issue.id,
    index: issue.index,
    title: issue.title,
    statusColor: color,
    isDone,
    dueDate: issue.dueDate && formatDate({ date: issue.dueDate, format: 'DD MMM' }),
    isLate: (issue.dueDate && isDateLessThanToday(issue.dueDate)) || false,
  };
}

export type ColumnType = {
  title: string;
  columnId: string;
  isDone: boolean;
  items: Issue[];
};

export type ColumnMap = { [columnId: string]: ColumnType };

export function useGetBasicData() {
  const { projectId } = useParams();
  const { kanban, ...rest } = useGetKanbanQuery({
    params: {},
    projectId: projectId || '',
  });

  const columnMap: ColumnMap = kanban
    .sort((a, b) => a.position - b.position)
    .reduce((acc, item) => {
      acc[item.id] = {
        title: item.name,
        columnId: item.id,
        isDone: item.isDone,
        items: item.issues.map((i) => getIssue(i, item.color, item.id, item.isDone)),
      };
      return acc;
    }, {});

  const orderedColumnIds = kanban.sort((a, b) => a.position - b.position).map((item) => item.id);

  return {
    columnMap,
    orderedColumnIds,
    ...rest,
  };
}
