const ENDPOINT_QUERIES = {
  overview: 'dashboard/overview',
  projectByStatus: 'dashboard/projects-by-year',
} as const;

const ENDPOINT_MUTATIONS = {} as const;

export const DASHBOARD_ENDPOINT_URL = {
  ...ENDPOINT_QUERIES,
  ...ENDPOINT_MUTATIONS,
} as const;
