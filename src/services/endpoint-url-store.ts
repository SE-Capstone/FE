import { AUTH_ENDPOINT_URL } from './auth';
import { ISSUES_ENDPOINT_URL } from './issue/issue-endpoint-url';
import { PERMISSIONS_ENDPOINT_URL } from './permissions/permissions-endpoint-url';
import { PROJECTS_ENDPOINT_URL } from './project';
import { ROLES_ENDPOINT_URL } from './roles';
import { USERS_ENDPOINT_URL } from './user';

export const ALL_ENDPOINT_URL_STORE = {
  auth: AUTH_ENDPOINT_URL,
  user: USERS_ENDPOINT_URL,
  roles: ROLES_ENDPOINT_URL,
  projects: PROJECTS_ENDPOINT_URL,
  issues: ISSUES_ENDPOINT_URL,
  permissions: PERMISSIONS_ENDPOINT_URL,
} as const;
