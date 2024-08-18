import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  currentUserInfo: 'user/profile',
} as const;

const ENDPOINT_MUTATIONS = {
  detail: (userId: StringNumeric) => `users/${userId}`,
} as const;

export const USER_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
