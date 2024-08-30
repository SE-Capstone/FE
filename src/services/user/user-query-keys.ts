import { createQueryKeys } from '@lukemorales/query-key-factory';

import { USERS_ENDPOINT_URL } from './user-endpoint-url';

export const userQueryKeys = createQueryKeys('user', {
  [USERS_ENDPOINT_URL.currentUserInfo]: null,
  [USERS_ENDPOINT_URL.updateProfile]: null,
  [USERS_ENDPOINT_URL.createUser]: null,
  [USERS_ENDPOINT_URL.listUser]: null,
  detail: (id: string) => ({ queryKey: [id] }),
});
