const ENDPOINT_QUERIES = {
  listPermission: 'group-permissions',
} as const;

const ENDPOINT_MUTATIONS = {
  createGroupPermission: 'group-permissions',
} as const;

export const PERMISSIONS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
