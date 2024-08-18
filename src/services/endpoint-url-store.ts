import { AUTH_ENDPOINT_URL } from './auth';
import { USER_ENDPOINT_URL } from './user';

export const ALL_ENDPOINT_URL_STORE = {
  auth: AUTH_ENDPOINT_URL,
  user: USER_ENDPOINT_URL,
} as const;
