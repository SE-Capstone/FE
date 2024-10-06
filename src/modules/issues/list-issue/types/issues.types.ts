import type { IBaseEntity } from '@/types';

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
  id: number;
  projectId: string;
  labelId: string;
  subject: string;
  description?: string;
  startDate: string;
  dueDate: string;
  statusId: string;
  priority: IssuePriorityEnum;
  lastUpdatedBy?: string;
  percentage: number;
  assigneeId: string;
  estimatedTime?: number;
};
