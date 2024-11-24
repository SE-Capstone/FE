import type { IBaseEntity } from '@/types';

export enum ProjectStatusEnum {
  NotStarted = 1,
  InProgress = 2,
  Completed = 3,
  Canceled = 4,
}

export type ProjectMember = {
  id: string;
  fullName: string;
  userName: string;
  roleName?: string;
  positionName?: string;
  positionId?: string;
  avatar?: string;
  isConfigurator?: boolean;
  isProjectConfigurator?: boolean;
  isIssueConfigurator?: boolean;
  isCommentConfigurator?: boolean;
};

export type QueryListProjectInput = {
  search?: string;
  status?: ProjectStatusEnum;
  isVisible?: boolean;
  startDate?: string;
  endDate?: string;
};

export type UserStatistics = {
  id: string;
  fullName: string;
  skills: string;
  activeProjectCount: number;
};

export type QuerySuggestMemberInput = {
  projectName: string;
  projectDetail: string;
  userStatistics: UserStatistics[];
};

export type IProject = IBaseEntity & {
  name: string;
  code: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatusEnum;
  isVisible: boolean;
  leadId?: string;
  leadName?: string;
  leadPosition?: string;
  leadAvatar?: string;
  myPermissions: [
    'IsProjectConfigurator',
    'IsIssueConfigurator',
    'IsMemberConfigurator',
    'IsCommentConfigurator'
  ];
  members: ProjectMember[];
};
