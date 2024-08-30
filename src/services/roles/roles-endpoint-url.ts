const ENDPOINT_QUERIES = {
  listRole: 'roles',
} as const;

const ENDPOINT_MUTATIONS = {
  createRole: 'roles',
  addRoleForUser: 'roles/add-role-for-user',
} as const;

export const ROLES_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
