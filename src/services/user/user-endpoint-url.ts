import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  currentUserInfo: 'user/profile',
  listUser: 'users',
  userForSuggest: 'users/active',
  getByPermission: 'users/get-by-permission',
  skillReport: 'users/reports/skills',
  detail: (userId: StringNumeric) => `users/${userId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  updateUser: 'users',
  updateProfile: 'user/update-profile',
  createUser: 'user',
  toggleStatus: `users/toggle-status`,
} as const;

export const USERS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
