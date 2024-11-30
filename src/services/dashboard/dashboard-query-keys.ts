import { createQueryKeys } from '@lukemorales/query-key-factory';

import { DASHBOARD_ENDPOINT_URL } from './dashboard-endpoint-url';

export const dashboardQueryKeys = createQueryKeys('dashboard', {
  [DASHBOARD_ENDPOINT_URL.overview]: null,
  [DASHBOARD_ENDPOINT_URL.projectByStatus]: null,
  userOverview: (id: string) => ({ queryKey: [id] }),
});
