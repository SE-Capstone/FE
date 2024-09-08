import { createQueryKeys } from '@lukemorales/query-key-factory';

import { PERMISSIONS_ENDPOINT_URL } from './permissions-endpoint-url';

export const permissionsQueryKeys = createQueryKeys('permission', {
  [PERMISSIONS_ENDPOINT_URL.listPermission]: null,
});
