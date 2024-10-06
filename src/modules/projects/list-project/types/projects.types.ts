import type { IBaseEntity } from '@/types';

export enum ProjectStatusEnum {
  Pending = 1,
  Active = 2,
  Inactive = 3,
}

export type ProjectMember = {
  id: string;
  fullName: string;
  userName: string;
  roleName: string;
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
  members: ProjectMember[];
};
