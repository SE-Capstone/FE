import type { GenderEnum, UserStatusEnum } from '@/configs';
import type { ICurrentUserResponse } from '@/modules/auth/types';

export type QueryListUserInput = {
  fullName?: string;
  email?: string;
  phone?: string;
  status?: UserStatusEnum;
  roleId?: string;
  gender?: GenderEnum;
};

export type IUser = ICurrentUserResponse & {
  roleId: string;
  roleName: string;
};
