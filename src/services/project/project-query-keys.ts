import { createQueryKeys } from '@lukemorales/query-key-factory';

import { PROJECTS_ENDPOINT_URL } from './project-endpoint-url';

export const projectQueryKeys = createQueryKeys('project', {
  [PROJECTS_ENDPOINT_URL.list]: null,
  detail: (id: string) => ({ queryKey: [id] }),
  toggleVisble: (id: string) => ({ queryKey: [`${id}/visible/toggle`] }),
});
