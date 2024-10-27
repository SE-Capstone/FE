import { createQueryKeys } from '@lukemorales/query-key-factory';

import { PHASES_ENDPOINT_URL } from './phase-endpoint-url';

export const phaseQueryKeys = createQueryKeys('phase', {
  [PHASES_ENDPOINT_URL.list]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
