import type { IBaseEntity } from '@/types';

export type QueryListPositionInput = {
  title?: string;
};

export type IPosition = IBaseEntity & {
  title: string;
  description: string;
  isDeleted: boolean;
  createdBy?: string;
  updatedBy?: string;
};
