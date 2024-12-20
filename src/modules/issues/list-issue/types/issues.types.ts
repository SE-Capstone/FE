import type { ILabel } from '@/modules/labels/types';
import type { IPhase } from '@/modules/phases/types';
import type { IStatus } from '@/modules/statuses/types';
import type { IUser } from '@/modules/users/list-user/types';
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
  title?: string;
  statusIds?: string[];
  labelIds?: string[];
  startDate?: string;
  dueDate?: string;
  reporterId?: string;
  assigneeIds?: string[];
  phaseIds: string[];
  priority?: IssuePriorityEnum;
};

export type QueryKanbanInput = QueryListIssueInput;

export interface IUpdatedBy {
  id: string;
  fullName: string;
  userName: string;
  roleName: string;
  positionName: string;
  avatar: string;
}

export type IComment = IBaseEntity & {
  id: string;
  userId: string;
  issueId: string;
  content: string;
  user: IUser;
};

export type IIssue = IBaseEntity & {
  projectId: string;
  label?: ILabel;
  title: string;
  index: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  actualDate?: string;
  status: IStatus;
  priority: IssuePriorityEnum;
  lastUpdateBy?: IUpdatedBy;
  reporter?: IUpdatedBy;
  assignee?: IUpdatedBy;
  percentage: number;
  assigneeAvatar?: string;
  estimatedTime?: number;
  actualTime?: number;
  comments?: IComment[];
  parentIssue?: IIssue;
  parentIssueId?: string;
  subIssues?: IIssue[];
  phase?: IPhase;
};
