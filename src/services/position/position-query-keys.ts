import { createQueryKeys } from '@lukemorales/query-key-factory';

import { POSITIONS_ENDPOINT_URL } from './position-endpoint-url';

export const positionQueryKeys = createQueryKeys('position', {
  [POSITIONS_ENDPOINT_URL.list]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
