import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'jobs',
  detail: (jobId: StringNumeric) => `jobs/${jobId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  update: `jobs`,
  delete: (jobId: StringNumeric) => `jobs/${jobId}`,
  create: 'jobs',
} as const;

export const JOBS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
