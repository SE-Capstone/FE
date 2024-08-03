import type { GenderEnum, RolesEnum } from '@/configs';
import type { IBaseEntity } from '@/types';

export interface IUserSignIn {
  id: string;
  email: string;
  refresh_token: string;
  access_token: string;
}

export interface ICurrentUserResponse extends IBaseEntity {
  avatar: string;
  fullName: string;
  phone: string;
  email: string;
  role: RolesEnum;
  gender: GenderEnum;
}
