import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  listRole: 'roles',
  detail: (roleId: StringNumeric) => `roles/${roleId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  create: 'roles',
  addRoleForUser: 'roles/add-role-for-user',
  update: 'roles',
} as const;

export const ROLES_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
