import { createQueryKeys } from '@lukemorales/query-key-factory';

import { STATUSES_ENDPOINT_URL } from './status-endpoint-url';

export const statusQueryKeys = createQueryKeys('status', {
  [STATUSES_ENDPOINT_URL.list]: null,
  [STATUSES_ENDPOINT_URL.listDefault]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
