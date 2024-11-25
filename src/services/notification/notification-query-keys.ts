import { createQueryKeys } from '@lukemorales/query-key-factory';

import { NOTIFICATIONS_ENDPOINT_URL } from './notification-endpoint-url';

export const notificationQueryKeys = createQueryKeys('notification', {
  [NOTIFICATIONS_ENDPOINT_URL.list]: null,
  [NOTIFICATIONS_ENDPOINT_URL.readAll]: null,
});
