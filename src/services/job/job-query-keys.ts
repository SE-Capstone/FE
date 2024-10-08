import { createQueryKeys } from '@lukemorales/query-key-factory';

import { JOBS_ENDPOINT_URL } from './job-endpoint-url';

export const jobQueryKeys = createQueryKeys('job', {
  [JOBS_ENDPOINT_URL.list]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
