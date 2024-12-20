import { APPLICANTS_ENDPOINT_URL } from './applicants';
import { AUTH_ENDPOINT_URL } from './auth';
import { COMMENTS_ENDPOINT_URL } from './comment';
import { DASHBOARD_ENDPOINT_URL } from './dashboard';
import { ISSUES_ENDPOINT_URL } from './issue/issue-endpoint-url';
import { JOBS_ENDPOINT_URL } from './job';
import { LABELS_ENDPOINT_URL } from './label';
import { NOTIFICATIONS_ENDPOINT_URL } from './notification';
import { PERMISSIONS_ENDPOINT_URL } from './permissions/permissions-endpoint-url';
import { PHASES_ENDPOINT_URL } from './phase';
import { POSITIONS_ENDPOINT_URL } from './position';
import { PROJECTS_ENDPOINT_URL } from './project';
import { ROLES_ENDPOINT_URL } from './roles';
import { SKILLS_ENDPOINT_URL } from './skill';
import { STATUSES_ENDPOINT_URL } from './status';
import { USERS_ENDPOINT_URL } from './user';

export const ALL_ENDPOINT_URL_STORE = {
  auth: AUTH_ENDPOINT_URL,
  user: USERS_ENDPOINT_URL,
  roles: ROLES_ENDPOINT_URL,
  projects: PROJECTS_ENDPOINT_URL,
  issues: ISSUES_ENDPOINT_URL,
  jobs: JOBS_ENDPOINT_URL,
  skills: SKILLS_ENDPOINT_URL,
  applicants: APPLICANTS_ENDPOINT_URL,
  permissions: PERMISSIONS_ENDPOINT_URL,
  positions: POSITIONS_ENDPOINT_URL,
  labels: LABELS_ENDPOINT_URL,
  notifications: NOTIFICATIONS_ENDPOINT_URL,
  statuses: STATUSES_ENDPOINT_URL,
  phases: PHASES_ENDPOINT_URL,
  comments: COMMENTS_ENDPOINT_URL,
  dashboard: DASHBOARD_ENDPOINT_URL,
} as const;
