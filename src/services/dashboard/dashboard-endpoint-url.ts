import type { StringNumeric } from '@/types';

const ENDPOINT_QUERIES = {
  overview: 'dashboard/overview',
  userOverview: (id: StringNumeric) => `dashboard/user-overview/${id}`,
  projectByStatus: 'dashboard/projects-by-year',
} as const;

const ENDPOINT_MUTATIONS = {} as const;

export const DASHBOARD_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
