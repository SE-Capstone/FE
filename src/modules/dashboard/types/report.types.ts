import type { IUser } from '@/modules/users/list-user/types';

export type SkillsReport = {
  id: string;
  title: string;
  description: string;
  userCount: number;
  users: IUser[];
};

export type QuerySkillsReportInput = {
  title?: string;
  minimumUsers?: number;
  maximumUsers?: number;
  userId?: string;
};
