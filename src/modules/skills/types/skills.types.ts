import type { IBaseEntity } from '@/types';

export type QueryListSkillInput = {
  title?: string;
};

export type ISkill = IBaseEntity & {
  title: string;
  description: string;
  isDeleted: boolean;
  createdBy: string;
  updatedBy?: string;
};
