import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'statuses',
  listDefault: 'statuses/default',
  detail: (statusId: StringNumeric) => `statuses/${statusId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  delete: (statusId: StringNumeric) => `statuses/${statusId}`,
  update: (statusId: StringNumeric) => `statuses/${statusId}`,
  create: 'statuses',
  deleteDefault: (statusId: StringNumeric) => `statuses/default/${statusId}`,
  updateDefault: (statusId: StringNumeric) => `statuses/default/${statusId}`,
  createDefault: 'statuses/default',
} as const;

export const STATUSES_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
