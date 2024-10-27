import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'skills',
  detail: (skillId: StringNumeric) => `skills/${skillId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  update: `skills`,
  delete: (skillId: StringNumeric) => `skills/${skillId}`,
  create: 'skills',
} as const;

export const SKILLS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
