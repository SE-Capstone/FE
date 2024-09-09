import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  currentUserInfo: 'user/profile',
  detail: (userId: StringNumeric) => `users/${userId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  updateUser: 'users',
  updateProfile: 'user/update-profile',
  createUser: 'user',
  listUser: 'users',
} as const;

export const USERS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
