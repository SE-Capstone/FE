export type QueryListRoleInput = {};

type IPermission = {
  id: string;
  name: string;
};

export type IRole = {
  id: string;
  name: string;
  permissions: IPermission[];
};
