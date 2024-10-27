import { createQueryKeys } from '@lukemorales/query-key-factory';

import { SKILLS_ENDPOINT_URL } from './skill-endpoint-url';

export const skillQueryKeys = createQueryKeys('skill', {
  [SKILLS_ENDPOINT_URL.list]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
