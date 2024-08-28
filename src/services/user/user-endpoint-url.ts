import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  currentUserInfo: 'user/profile',
} as const;

const ENDPOINT_MUTATIONS = {
  updateUser: (userId: StringNumeric) => `users/${userId}`,
  updateProfile: 'user/update-profile',
  createUser: 'user',
  listUser: 'users',
} as const;

export const USERS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
