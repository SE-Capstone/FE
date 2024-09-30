import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  list: 'projects',
  detail: (projectId: StringNumeric) => `projects/${projectId}`,
} as const;

const ENDPOINT_MUTATIONS = {
  update: (projectId: StringNumeric) => `projects/${projectId}`,
  create: 'projects',
  upsertMembers: 'projects/members',
  toggleVisible: (projectId: StringNumeric) => `projects/${projectId}/visible/toggle`,
} as const;

export const PROJECTS_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
