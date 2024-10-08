import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'applicants',
  detail: (jobId: StringNumeric) => `applicants/${jobId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  update: (jobId: StringNumeric) => `applicants/${jobId}`,
  create: 'applicants',
} as const;

export const APPLICANTS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
