import type { GenderEnum, UserStatusEnum } from '@/configs';
import type { IPermission } from '@/modules/roles/detail-role/apis/get-permissions.api';
import type { IBaseEntity } from '@/types';
import type { ThemingProps } from '@chakra-ui/react';

export interface ICurrentUserResponse extends IBaseEntity {
  id: string;
  avatar?: string;
  fullName: string;
  userName: string;
  phone?: string;
  address?: string;
  email: string;
  roleId?: string;
  roleName?: string;
  roleColor?: ThemingProps['colorScheme'];
  gender?: GenderEnum;
  dob?: Date;
  bankAccount?: string;
  bankAccountName?: string;
  positionName?: string;
  status: UserStatusEnum;
  deletedAt?: Date;
  permissions: IPermission[];
}
