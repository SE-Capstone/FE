import type { UserStatusEnum } from '@/configs';
import type { ICurrentUserResponse } from '@/modules/auth/types';

export type QueryListUserInput = {
  fullName?: string;
  status?: UserStatusEnum;
  roleId?: string;
};

export type IUser = ICurrentUserResponse & {
  roleId: string;
  roleName: string;
};
