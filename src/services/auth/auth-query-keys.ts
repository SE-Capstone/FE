import { createQueryKeys } from '@lukemorales/query-key-factory';

import { AUTH_ENDPOINT_URL } from './auth-endpoint-url';

export const authQueryKeys = createQueryKeys('auth', {
  [AUTH_ENDPOINT_URL.currentUserInfo]: null,
});
