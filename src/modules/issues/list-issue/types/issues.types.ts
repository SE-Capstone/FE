import type { IStatus } from '@/modules/statuses/types';
import type { IBaseEntity } from '@/types';
import type { ThemingProps } from '@chakra-ui/react';

export enum IssueStatusEnum {
  Pending = 1,
  Active = 2,
  Inactive = 3,
}

export enum IssuePriorityEnum {
  Lowest = 1,
  Low = 2,
  Medium = 3,
  High = 4,
  Highest = 5,
}

export type QueryListIssueInput = {
  subject?: string;
  statusId?: string;
  labelId?: string;
  priority?: IssuePriorityEnum;
};

export type IIssue = IBaseEntity & {
  projectId: string;
  label?: string;
  title: string;
  index: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  status: IStatus;
  priority: IssuePriorityEnum;
  lastUpdatedBy?: string;
  percentage: number;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  estimatedTime?: number;
};
