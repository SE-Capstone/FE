import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'labels',
  detail: (labelId: StringNumeric) => `labels/${labelId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  delete: (labelId: StringNumeric) => `labels/${labelId}`,
  update: (labelId: StringNumeric) => `labels/${labelId}`,
  create: 'labels',
} as const;

export const LABELS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
