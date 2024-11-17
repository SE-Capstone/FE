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
  description: string;
  permissions: IPermission[];
};
