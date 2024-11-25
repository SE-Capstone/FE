import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'notifications/mine',
} as const;

const ENDPOINT_MUTATIONS = {
  markRead: (id: StringNumeric) => `notifications/${id}/mark-read`,
  readAll: 'notifications/mark-read',
} as const;

export const NOTIFICATIONS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
