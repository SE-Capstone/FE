import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'statuses',
  detail: (statusId: StringNumeric) => `statuses/${statusId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  delete: (statusId: StringNumeric) => `statuses/${statusId}`,
  update: (statusId: StringNumeric) => `statuses/${statusId}`,
  create: 'statuses',
} as const;

export const STATUSES_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
