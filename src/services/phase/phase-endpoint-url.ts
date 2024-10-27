import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'phases',
} as const;

const ENDPOINT_MUTATIONS = {
  delete: (phaseId: StringNumeric) => `phases/${phaseId}`,
  update: (phaseId: StringNumeric) => `phases/${phaseId}`,
  create: 'phases',
  complete: 'phases/complete',
} as const;

export const PHASES_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
