import { createQueryKeys } from '@lukemorales/query-key-factory';

import { ROLES_ENDPOINT_URL } from './roles-endpoint-url';

export const roleQueryKeys = createQueryKeys('role', {
  [ROLES_ENDPOINT_URL.addRoleForUser]: null,
  [ROLES_ENDPOINT_URL.listRole]: null,
  detail: (roleId: string) => ({ queryKey: [roleId] }),
});
