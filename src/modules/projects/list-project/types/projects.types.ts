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
  roleName: string;
  positionName: string;
  avatar?: string;
};

export type QueryListProjectInput = {
  search?: string;
  status?: ProjectStatusEnum;
  isVisible?: boolean;
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
  members: ProjectMember[];
};
