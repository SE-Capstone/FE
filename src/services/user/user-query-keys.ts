import { createQueryKeys } from '@lukemorales/query-key-factory';

import { USER_ENDPOINT_URL } from './user-endpoint-url';

export const userQueryKeys = createQueryKeys('user', {
  [USER_ENDPOINT_URL.currentUserInfo]: null,
});
