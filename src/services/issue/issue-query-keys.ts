import { createQueryKeys } from '@lukemorales/query-key-factory';

import { ISSUES_ENDPOINT_URL } from './issue-endpoint-url';

export const issueQueryKeys = createQueryKeys('issue', {
  [ISSUES_ENDPOINT_URL.list]: null,
  [ISSUES_ENDPOINT_URL.kanban]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
