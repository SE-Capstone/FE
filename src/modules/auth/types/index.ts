import type { GenderEnum, RolesEnum, UserStatusEnum } from '@/configs';
import type { IBaseEntity } from '@/types';

export interface IUserSignIn {
  id: string;
  email: string;
  refresh_token: string;
  access_token: string;
}

export interface ICurrentUserResponse extends IBaseEntity {
  id: string;
  avatar?: string;
  fullName: string;
  phone?: string;
  address?: string;
  email: string;
  role?: RolesEnum;
  gender?: GenderEnum;
  dob?: Date;
  bankAccount?: string;
  bankAccountName?: string;
  status?: UserStatusEnum;
}
