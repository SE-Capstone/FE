import type { IBaseEntity } from '@/types';

export type QueryListJobInput = {
  title?: string;
};

export type IJob = IBaseEntity & {
  id: number;
  title: string;
  description: string;
  isDeleted: boolean;
  createdBy: string;
  updatedBy?: string;
};
