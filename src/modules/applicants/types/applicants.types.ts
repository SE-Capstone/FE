import type { IBaseEntity } from '@/types';

export type QueryListApplicantInput = {
  email?: string;
  name?: string;
};

export type IApplicant = IBaseEntity & {
  name: string;
  email: string;
  startDate?: Date;
  phoneNumber: string;
  cvLink?: string;
  isDeleted: boolean;
  isOnBoard?: boolean;
  createdBy: string;
  updatedBy?: string;
  mainJobId: string;
};
