import type { ICurrentUserResponse } from '@/modules/auth/types';

export enum UserStatus {
  Active = 1,
  Inactive = 2,
}

export type QueryListUserInput = {
  search?: string;
  phone?: string;
  status?: UserStatus;
  role?: string;
};

export type IUser = ICurrentUserResponse & {
  roleId: string;
  roleName: string;
};
