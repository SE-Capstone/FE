import { authPaths } from './auth.paths';
import { issuesPaths } from './issues.paths';
import { profilePaths } from './profile.paths';
import { projectsPaths } from './projects.path';
import { rolesPaths } from './roles.path';
import { usersPaths } from './users.paths';

export const APP_PATHS = {
  HOME: '/',
  'not-found': '/not-found',
  ...authPaths,
  ...profilePaths,
  ...usersPaths,
  ...rolesPaths,
  ...issuesPaths,
  ...projectsPaths,
} as const;
