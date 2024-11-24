import { createQueryKeys } from '@lukemorales/query-key-factory';

import { PROJECTS_ENDPOINT_URL } from './project-endpoint-url';

export const projectQueryKeys = createQueryKeys('project', {
  [PROJECTS_ENDPOINT_URL.list]: null,
  [PROJECTS_ENDPOINT_URL.suggestMember]: null,
  detail: (id: string) => ({ queryKey: [id] }),
  members: (id: string) => ({ queryKey: [`${id}/members`] }),
  toggleVisble: (id: string) => ({ queryKey: [`${id}/visible/toggle`] }),
});
