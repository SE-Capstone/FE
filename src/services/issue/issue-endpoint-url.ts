import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'issues',
  detail: (issueId: StringNumeric) => `issues/${issueId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  update: (issueId: StringNumeric) => `issues/${issueId}`,
  create: 'issues',
} as const;

export const ISSUES_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
