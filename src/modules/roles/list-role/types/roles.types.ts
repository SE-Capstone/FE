import type { ThemingProps } from '@chakra-ui/react';

export type QueryListRoleInput = {
  name?: string;
};

type IPermission = {
  id: string;
  name: string;
};

export type IRole = {
  id: string;
  name: string;
  color: ThemingProps['colorScheme'];
  description: string;
  permissions: IPermission[];
};
