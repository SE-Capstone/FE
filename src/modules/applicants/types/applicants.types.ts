import type { IBaseEntity } from '@/types';

export type QueryListApplicantInput = {
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  jobIds?: string[];
};

export type IApplicant = IBaseEntity & {
  id: number;
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
