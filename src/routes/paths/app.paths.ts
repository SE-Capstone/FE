import { applicantsPaths } from './applicants.path';
import { authPaths } from './auth.paths';
import { issuesPaths } from './issues.paths';
import { jobsPaths } from './jobs.path';
import { positionsPaths } from './position.path';
import { profilePaths } from './profile.paths';
import { projectsPaths } from './projects.path';
import { rolesPaths } from './roles.path';
import { skillsPaths } from './skills.path';
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
  ...jobsPaths,
  ...applicantsPaths,
  ...positionsPaths,
  ...skillsPaths,
} as const;
