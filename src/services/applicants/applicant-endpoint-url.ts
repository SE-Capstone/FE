import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'applicants',
} as const;

const ENDPOINT_MUTATIONS = {
  delete: (applicantId: StringNumeric) => `applicants/${applicantId}`,
  update: (applicantId: StringNumeric) => `applicants/${applicantId}`,
  create: 'applicants',
} as const;

export const APPLICANTS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
