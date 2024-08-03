import { authPaths } from './auth.paths';
import { guaranteesPaths } from './guarantees.paths';
import { productsPaths } from './products.path';
import { profilePaths } from './profile.paths';
import { requestGuaranteesPaths } from './request-guarantee';
import { usersPaths } from './users.paths';

export const APP_PATHS = {
  HOME: '/',
  'not-found': '/not-found',
  ...authPaths,
  ...profilePaths,
  ...usersPaths,
  ...productsPaths,
  ...guaranteesPaths,
  ...requestGuaranteesPaths,
} as const;
