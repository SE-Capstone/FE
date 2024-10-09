import type { IBaseEntity } from '@/types';

export type QueryListPositionInput = {
  title?: string;
};

export type IPosition = IBaseEntity & {
  id: number;
  title: string;
  description: string;
  isDeleted: boolean;
  createdBy: string;
  updatedBy?: string;
};
