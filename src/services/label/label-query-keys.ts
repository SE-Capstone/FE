import { createQueryKeys } from '@lukemorales/query-key-factory';

import { LABELS_ENDPOINT_URL } from './label-endpoint-url';

export const labelQueryKeys = createQueryKeys('label', {
  [LABELS_ENDPOINT_URL.list]: null,
  [LABELS_ENDPOINT_URL.listDefault]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
