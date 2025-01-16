import type { IBaseEntity } from '@/types';

export type QueryListSkillInput = {
  title?: string;
};

export enum SkillLevelEnum {
  Novice = '1',
  AdvancedBeginner = '2',
  Competent = '3',
  Proficient = '4',
  Expert = '5',
}

export type ISkill = IBaseEntity & {
  title: string;
  description: string;
  level: SkillLevelEnum;
  isDeleted: boolean;
  createdBy: string;
  updatedBy?: string;
};
