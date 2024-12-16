import { createQueryKeys } from '@lukemorales/query-key-factory';

import { PROJECTS_ENDPOINT_URL } from './project-endpoint-url';

export const projectQueryKeys = createQueryKeys('project', {
  [PROJECTS_ENDPOINT_URL.list]: null,
  [PROJECTS_ENDPOINT_URL.suggestMember]: null,
  [PROJECTS_ENDPOINT_URL.statusReport]: null,
  [PROJECTS_ENDPOINT_URL.projectOverview]: null,
  [PROJECTS_ENDPOINT_URL.projectAnalysis]: null,
  [PROJECTS_ENDPOINT_URL.completeTaskReportByDate]: null,
  detail: (id: string) => ({ queryKey: [id] }),
  members: (id: string) => ({ queryKey: [`${id}/members`] }),
  toggleVisble: (id: string) => ({ queryKey: [`${id}/visible/toggle`] }),
});
